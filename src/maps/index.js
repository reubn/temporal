import MapboxGL from '@react-native-mapbox-gl/maps'

import {appColours, mapboxToken} from '../config'

MapboxGL.setAccessToken(mapboxToken)
MapboxGL.setTelemetryEnabled(false)

MapboxGL.offlineManager.createPack({
  name: `offlinePack-${appColours.mapStyle}`,
  styleURL: appColours.mapStyle,
  minZoom: 10,
  maxZoom: 16,
  bounds: [[
          -2.960793972015381,
          53.40990278269263
        ], [
          -2.970771789550781,
          53.40027035516909
        ]]
}).catch(() => null)
