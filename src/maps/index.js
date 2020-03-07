import MapboxGL from '@react-native-mapbox-gl/maps'

import {mapboxToken} from '../config'
import {light,dark} from '../config/appColours'

MapboxGL.setAccessToken(mapboxToken)
MapboxGL.setTelemetryEnabled(false)

MapboxGL.offlineManager.createPack({
  name: `offlinePack-${light.mapStyle}`,
  styleURL: light.mapStyle,
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

MapboxGL.offlineManager.createPack({
  name: `offlinePack-${dark.mapStyle}`,
  styleURL: dark.mapStyle,
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
