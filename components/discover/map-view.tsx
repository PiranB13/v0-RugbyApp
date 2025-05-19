"use client"

import { useEffect, useRef, useState } from "react"
import Script from "next/script"
import { Button } from "@/components/ui/button"
import { Locate } from "lucide-react"
import { toast } from "@/components/ui/use-toast"

// Define the props type
interface MapViewProps {
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

export function MapView({ results }: MapViewProps) {
  const mapInitialized = useRef(false)
  const mapRef = useRef<any>(null)
  const markersRef = useRef<any>(null)
  const userMarkerRef = useRef<any>(null)
  const [isLocating, setIsLocating] = useState(false)
  const [scriptsLoaded, setScriptsLoaded] = useState(false)

  // Check if scripts are loaded
  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      window.L &&
      document.getElementById("leaflet-css") !== null &&
      document.getElementById("leaflet-script") !== null &&
      document.getElementById("leaflet-cluster-css") !== null &&
      document.getElementById("leaflet-cluster-script") !== null
    ) {
      setScriptsLoaded(true)
    }
  }, [])

  useEffect(() => {
    // Only run on client and when scripts are loaded
    if (typeof window === "undefined" || !scriptsLoaded) return

    // Initialize map once
    if (!mapInitialized.current) {
      const mapElement = document.getElementById("map-container")
      if (!mapElement) return

      // Create map
      const L = window.L
      const map = L.map("map-container", {
        center: [51.505, -0.09], // London (default)
        zoom: 12,
      })
      mapRef.current = map

      // Add tile layer
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map)

      // Create marker cluster group
      const markers = L.markerClusterGroup({
        maxClusterRadius: 50,
        spiderfyOnMaxZoom: true,
        showCoverageOnHover: false,
        zoomToBoundsOnClick: true,
      })
      markersRef.current = markers

      // Add markers for each result
      addMarkersToMap()

      // Add custom CSS
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
        .leaflet-marker-icon {
          border: none;
          background: none;
        }
        .user-location-marker {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background-color: #3b82f6;
          border: 3px solid white;
          box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.5), 0 0 10px rgba(0, 0, 0, 0.35);
        }
        .user-location-pulse {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background-color: rgba(59, 130, 246, 0.2);
          border: 3px solid rgba(59, 130, 246, 0.5);
          position: absolute;
          top: -8px;
          left: -8px;
          animation: pulse 2s infinite;
        }
        @keyframes pulse {
          0% {
            transform: scale(0.5);
            opacity: 1;
          }
          100% {
            transform: scale(1.5);
            opacity: 0;
          }
        }
        .locate-control {
          position: absolute;
          top: 80px;
          right: 10px;
          z-index: 1000;
        }
      `
      document.head.appendChild(style)

      // Hide loading indicator
      const loadingElement = document.getElementById("map-loading")
      if (loadingElement) {
        loadingElement.style.display = "none"
      }

      // Update mapInitialized ref
      mapInitialized.current = true

      // Clean up map on component unmount
      return () => {
        if (map) {
          map.remove()
        }
        mapInitialized.current = false
        if (style.parentNode) {
          style.parentNode.removeChild(style)
        }
      }
    }
  }, [scriptsLoaded, results])

  // Update markers when results change
  useEffect(() => {
    if (mapInitialized.current && markersRef.current) {
      addMarkersToMap()
    }
  }, [results])

  // Function to add markers to the map
  const addMarkersToMap = () => {
    if (!mapRef.current || !markersRef.current) return

    const L = window.L
    const map = mapRef.current
    const markers = markersRef.current

    // Clear existing markers
    markers.clearLayers()

    // Add markers for each result
    const latLngs = []
    results.forEach((result) => {
      const { lat, lng } = result.location

      // Determine marker color based on result type
      const markerColor =
        result.type === "player"
          ? "#4f46e5" // indigo
          : result.type === "coach"
            ? "#0891b2" // cyan
            : "#7c3aed" // purple

      // Create custom icon
      const icon = L.divIcon({
        className: "custom-marker-icon",
        html: `<div style="background-color: ${markerColor}; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 2px solid white; box-shadow: 0 2px 5px rgba(0,0,0,0.2);">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            ${
              result.type === "player"
                ? '<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle>'
                : result.type === "coach"
                  ? '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path>'
                  : '<path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"></path><path d="M3 6h18"></path><path d="M16 10a4 4 0 0 1-8 0"></path>'
            }
          </svg>
        </div>`,
        iconSize: [30, 30],
        iconAnchor: [15, 15],
      })

      // Create marker
      const marker = L.marker([lat, lng], { icon })

      // Add popup to marker
      marker.bindPopup(`
        <div class="map-popup">
          <div class="flex items-center gap-2 mb-1">
            <div class="w-8 h-8 rounded-full bg-muted flex items-center justify-center overflow-hidden">
              <img src="${result.imageUrl || "/rugby-match.png"}" 
                   alt="${result.name}" 
                   class="w-full h-full object-cover"
                   onerror="this.onerror=null; this.src='/rugby-match.png';">
            </div>
            <div>
              <div class="font-medium">${result.name}</div>
              <div class="text-xs text-gray-500">
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
            <a href="/${result.type}s/${result.id}" class="text-xs font-medium text-blue-600 hover:underline">
              View Profile
            </a>
          </div>
        </div>
      `)

      // Add marker to cluster group and collect coordinates for bounds
      markers.addLayer(marker)
      latLngs.push([lat, lng])
    })

    // Add cluster group to map
    map.addLayer(markers)

    // Fit map to markers if available
    if (latLngs.length > 0) {
      map.fitBounds(L.latLngBounds(latLngs), { padding: [50, 50] })
    }
  }

  // Function to get user's location and center map
  const getUserLocation = () => {
    if (!mapInitialized.current || !mapRef.current) return

    setIsLocating(true)

    if (!navigator.geolocation) {
      toast({
        title: "Geolocation not supported",
        description: "Your browser doesn't support geolocation.",
        variant: "destructive",
      })
      setIsLocating(false)
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords
        const L = window.L
        const map = mapRef.current

        // Center map on user location
        map.setView([latitude, longitude], 13)

        // Add or update user location marker
        if (userMarkerRef.current) {
          map.removeLayer(userMarkerRef.current)
        }

        // Create custom user location marker
        const userLocationIcon = L.divIcon({
          className: "user-location-marker-container",
          html: `
            <div class="user-location-pulse"></div>
            <div class="user-location-marker"></div>
          `,
          iconSize: [24, 24],
          iconAnchor: [12, 12],
        })

        const userMarker = L.marker([latitude, longitude], { icon: userLocationIcon, zIndexOffset: 1000 })
          .addTo(map)
          .bindPopup("Your current location")

        userMarkerRef.current = userMarker

        // Calculate distances to all results
        const resultsWithDistance = results.map((result) => {
          const resultLatLng = L.latLng(result.location.lat, result.location.lng)
          const userLatLng = L.latLng(latitude, longitude)
          const distanceInMeters = userLatLng.distanceTo(resultLatLng)
          const distanceInKm = distanceInMeters / 1000
          return {
            ...result,
            distance: distanceInKm,
          }
        })

        // Show success message with nearest result
        if (resultsWithDistance.length > 0) {
          // Sort by distance
          const sortedResults = [...resultsWithDistance].sort((a, b) => a.distance - b.distance)
          const nearest = sortedResults[0]

          toast({
            title: "Location found",
            description: `Nearest ${nearest.type}: ${nearest.name} (${nearest.distance.toFixed(1)} km away)`,
          })
        } else {
          toast({
            title: "Location found",
            description: "Map centered on your current location.",
          })
        }

        setIsLocating(false)
      },
      (error) => {
        let errorMessage = "Unable to retrieve your location."

        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = "Location access was denied. Please enable location services."
            break
          case error.POSITION_UNAVAILABLE:
            errorMessage = "Location information is unavailable."
            break
          case error.TIMEOUT:
            errorMessage = "The request to get your location timed out."
            break
        }

        toast({
          title: "Location error",
          description: errorMessage,
          variant: "destructive",
        })

        setIsLocating(false)
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      },
    )
  }

  return (
    <>
      {/* Load Leaflet CSS */}
      <link
        id="leaflet-css"
        rel="stylesheet"
        href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
        integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
        crossOrigin="anonymous"
      />

      {/* Load MarkerCluster CSS */}
      <link
        id="leaflet-cluster-css"
        rel="stylesheet"
        href="https://unpkg.com/leaflet.markercluster@1.5.3/dist/MarkerCluster.css"
        crossOrigin="anonymous"
      />
      <link
        rel="stylesheet"
        href="https://unpkg.com/leaflet.markercluster@1.5.3/dist/MarkerCluster.Default.css"
        crossOrigin="anonymous"
      />

      {/* Load Leaflet JS */}
      <Script
        id="leaflet-script"
        src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"
        integrity="sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo="
        crossOrigin="anonymous"
        strategy="beforeInteractive"
        onLoad={() => setScriptsLoaded(true)}
      />

      {/* Load MarkerCluster JS */}
      <Script
        id="leaflet-cluster-script"
        src="https://unpkg.com/leaflet.markercluster@1.5.3/dist/leaflet.markercluster.js"
        crossOrigin="anonymous"
        strategy="beforeInteractive"
        onLoad={() => setScriptsLoaded(true)}
      />

      {/* Map container */}
      <div className="relative h-full w-full">
        <div id="map-container" className="h-full w-full"></div>

        <div id="map-loading" className="absolute inset-0 flex items-center justify-center bg-muted/20 z-[1000]">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-4"></div>
            <p className="text-muted-foreground">Loading map...</p>
          </div>
        </div>

        <div className="locate-control">
          <Button
            variant="secondary"
            size="sm"
            className="shadow-md bg-white hover:bg-gray-100"
            onClick={getUserLocation}
            disabled={isLocating || !scriptsLoaded}
          >
            <Locate className={`h-4 w-4 ${isLocating ? "animate-pulse" : ""}`} />
            <span className="sr-only">Find my location</span>
          </Button>
        </div>
      </div>

      {/* Add global type definition for Leaflet */}
      <Script id="leaflet-typedefs">
        {`
          if (typeof window !== 'undefined') {
            window.L = window.L || {};
          }
        `}
      </Script>
    </>
  )
}
