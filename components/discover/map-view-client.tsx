"use client"

import { useEffect, useRef } from "react"
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import "leaflet.markercluster/dist/leaflet.markercluster"
import "leaflet.markercluster/dist/MarkerCluster.css"
import "leaflet.markercluster/dist/MarkerCluster.Default.css"

// Define the props type for our component
interface MapViewClientProps {
  results: Array<{
    id: string
    type: string
    name: string
    position?: string
    region: string
    availability: string
    level: string
    imageUrl?: string
    lastActive: string
    distance?: number
    isVerified?: boolean
    location: {
      lat: number
      lng: number
      address?: string
    }
  }>
}

// Define custom marker icons
const createCustomIcon = (type: string, color: string) => {
  return L.divIcon({
    className: "custom-marker-icon",
    html: `<div style="background-color: ${color}; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 2px solid white; box-shadow: 0 2px 5px rgba(0,0,0,0.2);">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        ${
          type === "player"
            ? '<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle>'
            : type === "coach"
              ? '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path>'
              : '<path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"></path><path d="M3 6h18"></path><path d="M16 10a4 4 0 0 1-8 0"></path>'
        }
      </svg>
    </div>`,
    iconSize: [30, 30],
    iconAnchor: [15, 15],
  })
}

// Create marker cluster group
const createClusterGroup = () => {
  return L.markerClusterGroup({
    maxClusterRadius: 50,
    spiderfyOnMaxZoom: true,
    showCoverageOnHover: false,
    zoomToBoundsOnClick: true,
    iconCreateFunction: (cluster) => {
      const count = cluster.getChildCount()
      return L.divIcon({
        html: `<div class="cluster-icon">${count}</div>`,
        className: "custom-marker-cluster",
        iconSize: L.point(40, 40),
      })
    },
  })
}

export function MapViewClient({ results }: MapViewClientProps) {
  const mapRef = useRef<L.Map | null>(null)
  const clusterGroupRef = useRef<L.MarkerClusterGroup | null>(null)

  // Initialize map and markers
  useEffect(() => {
    // Fix the Leaflet icon issue
    delete L.Icon.Default.prototype._getIconUrl
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: "/marker-icon-2x.png",
      iconUrl: "/marker-icon.png",
      shadowUrl: "/marker-shadow.png",
    })

    // Initialize map if it doesn't exist
    if (!mapRef.current) {
      // Default center (London)
      const defaultCenter: [number, number] = [51.505, -0.09]

      // Create map
      mapRef.current = L.map("map-container").setView(defaultCenter, 12)

      // Add tile layer
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(mapRef.current)

      // Add CSS for custom markers and popups
      const style = document.createElement("style")
      style.textContent = `
        .custom-popup .leaflet-popup-content-wrapper {
          border-radius: 0.5rem;
          padding: 0;
        }
        .custom-popup .leaflet-popup-content {
          margin: 12px;
          min-width: 200px;
        }
        .map-popup {
          font-family: ui-sans-serif, system-ui, sans-serif;
        }
        .custom-marker-cluster {
          background: white;
          border-radius: 50%;
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
        }
        .cluster-icon {
          background-color: #4f46e5;
          color: white;
          width: 100%;
          height: 100%;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          font-size: 14px;
          border: 2px solid white;
        }
      `
      document.head.appendChild(style)
    }

    // Create cluster group if it doesn't exist
    if (!clusterGroupRef.current && mapRef.current) {
      clusterGroupRef.current = createClusterGroup()
      mapRef.current.addLayer(clusterGroupRef.current)
    }

    // Clear existing markers
    if (clusterGroupRef.current) {
      clusterGroupRef.current.clearLayers()
    }

    // Add markers to the cluster group
    if (mapRef.current && clusterGroupRef.current) {
      const markers = results.map((result) => {
        const { lat, lng } = result.location

        // Create marker with custom icon
        const markerColor =
          result.type === "player"
            ? "#4f46e5" // indigo
            : result.type === "coach"
              ? "#0891b2" // cyan
              : "#7c3aed" // purple

        const marker = L.marker([lat, lng], {
          icon: createCustomIcon(result.type, markerColor),
        })

        // Create popup content
        const popupContent = document.createElement("div")
        popupContent.className = "map-popup"
        popupContent.innerHTML = `
          <div class="flex items-center gap-2 mb-1">
            <div class="w-8 h-8 rounded-full bg-muted flex items-center justify-center overflow-hidden">
              <img src="${result.imageUrl || "/rugby-match.png"}" 
                   alt="${result.name}" 
                   class="w-full h-full object-cover"
                   onerror="this.onerror=null; this.src='/rugby-match.png';">
            </div>
            <div>
              <div class="font-medium">${result.name}</div>
              <div class="text-xs text-muted-foreground">
                ${result.type === "player" && result.position ? result.position : ""}
                ${result.type === "coach" ? "Coach" : ""}
                ${result.type === "club" ? "Club" : ""}
                ${result.level ? ` • ${result.level}` : ""}
              </div>
            </div>
          </div>
          <div class="text-xs mb-2">
            <span class="inline-flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" class="mr-1">
                <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
              ${result.location.address || result.region}
            </span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-xs px-1.5 py-0.5 rounded ${
              result.availability === "Available"
                ? "bg-green-100 text-green-800"
                : result.availability === "Limited Availability"
                  ? "bg-yellow-100 text-yellow-800"
                  : result.availability === "Not Available"
                    ? "bg-red-100 text-red-800"
                    : result.availability === "Recruiting"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-purple-100 text-purple-800"
            }">
              <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" class="mr-1 inline-block">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
              ${result.availability}
            </span>
            <a href="/${result.type}s/${result.id}" class="text-xs font-medium text-primary hover:underline">
              View Profile
            </a>
          </div>
        `

        // Create and bind popup
        const popup = L.popup({
          closeButton: true,
          className: "custom-popup",
          maxWidth: 300,
        }).setContent(popupContent)

        marker.bindPopup(popup)
        return marker
      })

      // Add all markers to the cluster group
      clusterGroupRef.current.addLayers(markers)

      // Fit map to bounds if there are markers
      if (markers.length > 0) {
        const bounds = L.featureGroup(markers).getBounds()
        mapRef.current.fitBounds(bounds, { padding: [50, 50] })
      }
    }

    // Cleanup function
    return () => {
      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current = null
      }
      clusterGroupRef.current = null
    }
  }, [results])

  return <div id="map-container" className="h-full w-full"></div>
}
