import React, { useEffect, useRef } from 'react';

export default function LeafletMap({
  center = [13.0850, 80.2101],
  zoom = 13,
  markers = [],
  title = 'Pickup Location',
  height = '240px',
  interactive = true
}) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);

  useEffect(() => {
    // Check if window.L is available
    if (typeof window !== 'undefined' && window.L && mapContainerRef.current) {
      // Clean up previous instance if exists
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }

      try {
        const map = window.L.map(mapContainerRef.current, {
          center: center,
          zoom: zoom,
          zoomControl: interactive,
          scrollWheelZoom: false,
          dragging: interactive
        });

        window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; OpenStreetMap contributors'
        }).addTo(map);

        // Custom Marker Icon matching theme primary
        const customIcon = window.L.divIcon({
          className: 'custom-map-pin',
          html: `
            <div style="
              width: 32px;
              height: 32px;
              background: #245C45;
              color: white;
              border-radius: 50% 50% 50% 0;
              transform: rotate(-45deg);
              display: flex;
              align-items: center;
              justify-content: center;
              box-shadow: 0 4px 10px rgba(36,92,69,0.45);
              border: 2px solid white;
            ">
              <svg style="transform: rotate(45deg); display: block;" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/>
                <circle cx="7" cy="17" r="2"/>
                <circle cx="17" cy="17" r="2"/>
              </svg>
            </div>
          `,
          iconSize: [32, 32],
          iconAnchor: [16, 32],
          popupAnchor: [0, -28]
        });

        // Add main marker
        const mainMarker = window.L.marker(center, { icon: customIcon }).addTo(map);
        mainMarker.bindPopup(`<strong>${title}</strong><br/>Anna Nagar Central Hub`).openPopup();

        // Add additional markers if provided
        markers.forEach(m => {
          if (m.coords) {
            window.L.marker(m.coords, { icon: customIcon })
              .addTo(map)
              .bindPopup(`<strong>${m.title}</strong><br/>${m.price ? '₹ ' + m.price + '/day' : ''}`);
          }
        });

        mapInstanceRef.current = map;

        // Invalidate size after rendering to fix partial tiles
        setTimeout(() => {
          if (mapInstanceRef.current) {
            mapInstanceRef.current.invalidateSize();
          }
        }, 200);
      } catch (err) {
        console.warn('Leaflet initialization error:', err);
      }
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [center[0], center[1], zoom, markers.length]);

  return (
    <div style={{ position: 'relative', width: '100%', height, borderRadius: '12px', overflow: 'hidden' }}>
      <div ref={mapContainerRef} style={{ width: '100%', height: '100%' }} />
    </div>
  );
}
