import 'leaflet/dist/images/layers-2x.png';
import 'leaflet/dist/images/layers.png';
import 'leaflet/dist/images/marker-icon-2x.png';
import 'leaflet/dist/images/marker-icon.png';
import 'leaflet/dist/images/marker-shadow.png';

import IndexField from './components/IndexField'
import DetailField from './components/DetailField'
import FormField from './components/FormField'
import PreviewField from './components/PreviewField'

Nova.booting((app, store) => {
  app.component('index-nova-map-marker-field', IndexField)
  app.component('detail-nova-map-marker-field', DetailField)
  app.component('form-nova-map-marker-field', FormField)
  // app.component('preview-nova-map-marker-field', PreviewField)
})
