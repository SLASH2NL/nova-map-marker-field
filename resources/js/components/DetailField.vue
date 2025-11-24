<script>
import { FormField, HandlesValidationErrors } from 'laravel-nova';
import { LIcon, LPolygon, LCircle, LMap, LMarker, LTileLayer } from '@vue-leaflet/vue-leaflet';

export default {
    components: {
        LCircle,
        LIcon,
        LMap,
        LMarker,
        LPolygon,
        LTileLayer,
    },

    mixins: [FormField, HandlesValidationErrors],

    props: ['index', 'resource', 'resourceName', 'resourceId', 'field'],

    data: function () {
        return {
            iconRetina: this.field.iconRetinaUrl
                || '/vendor/leaflet/dist/marker-icon-2x.png',
            icon: this.field.iconUrl
                || '/vendor/leaflet/dist/marker-icon.png',
            shadow: this.field.shadowUrl
                || '/vendor/leaflet/dist/marker-shadow.png',
            tileUrl: 'https://{s}.tile.osm.org/{z}/{x}/{y}.png',
            mapOptions: {
                boxZoom: false,
                doubleClickZoom: 'center',
                dragging: false,
                scrollWheelZoom: 'center',
                touchZoom: 'center',
            },
            markerOptions: {
                interactive: false,
            },
        };
    },

    created: function () {
        if (this.field.tileProvider !== undefined) {
            this.tileUrl = this.field.tileProvider;
        }
    },

    computed: {
        circleColor: function () {
            return ((this.field.centerCircle || {}).color || 'gray');
        },

        circleHasRadius: function () {
            return this.circleRadius > 0;
        },

        circleHasStroke: function () {
            return this.circleStroke > 0;
        },

        circleOpacity: function () {
            return ((this.field.centerCircle || {}).opacity || 0.2);
        },

        circleRadius: function () {
            return ((this.field.centerCircle || {}).radius || 0);
        },

        circleStroke: function () {
            return ((this.field.centerCircle || {}).border || 0);
        },

        polygons: function () {
            return this.field.polygons || [];
        },

        defaultZoom: function () {
            return this.field.defaultZoom || 12;
        },

        locationIsSet: function () {
            if (this.value.length === 0) {
                this.setInitialValue();
            }

            let value = JSON.parse(this.value);

            return value.latitude !== 0
                || value.longitude !== 0;
        },

        locationIsNotSet: function () {
            return !this.locationIsSet;
        },

        mapCenter: function () {
            if (this.value.length === 0) {
                this.setInitialValue();
            }

            let value = JSON.parse(this.value);

            return [
                (value.latitude || this.field.defaultLatitude || 0),
                (value.longitude || this.field.defaultLongitude || 0),
            ];
        },
    },

    methods: {
        fill: function (formData) {
            formData.append(this.field.attribute, this.value || '');
        },

        handleChange: function (value) {
            this.setValue(value.latitude, value.longitude);
        },

        mapMoved: function (event) {
            let coordinates = event.target.getCenter();

            this.setValue(coordinates.lat, coordinates.lng);
        },

        setInitialValue: function () {
            let value = JSON.parse(this.value || this.field.value);

            this.setValue(value.latitude, value.longitude);
        },

        setValue: function (latitude, longitude) {
            this.value = '{"latitude_field":'
                + '"' + (this.field.latitude || 'latitude') + '"'
                + ',"longitude_field":'
                + '"' + (this.field.longitude || 'longitude') + '"'
                + ',"latitude":'
                + (latitude || 0)
                + ',"longitude":'
                + (longitude || 0)
                + '}';
        },
    },
};
</script>

<template>
    <panel-item :field="field" :label="field.name">
        <template #value>
            <span
                v-if="locationIsNotSet"
            >
                &#8212;
            </span>
            <div class="map-field">
                <l-map
                    v-if="locationIsSet"
                    class="z-10 w-full form-control form-input form-control-bordered overflow-hidden relative"
                    ref="map"
                    :center="mapCenter"
                    :options="mapOptions"
                    :zoom="defaultZoom"
                    :minZoom="3"
                    :maxZoom="18"
                    @move="mapMoved"
                    useGlobalLeaflet="true"
                >
                    <l-tile-layer
                        :url="tileUrl"
                    ></l-tile-layer>

                    <l-marker
                        :options="markerOptions"
                        :lat-lng="mapCenter"
                    >
                        <l-icon
                            :icon-url="this.icon"
                            :icon-retina-url="this.iconRetina"
                            :shadow-url="this.shadow"
                        />
                    </l-marker>

                    <l-circle
                        v-if="circleHasRadius"
                        :lat-lng="mapCenter"
                        :radius="circleRadius"
                        :color="circleColor"
                        :fillColor="circleColor"
                        :weight="circleStroke"
                        :fillOpacity="circleOpacity"
                    />

                    <l-polygon
                        v-for="(polygon, index) in polygons"
                        :key="index"
                        v-bind="polygon"
                    />
                </l-map>
            </div>
        </template>
    </panel-item>
</template>

<style scoped>
    @import "~leaflet/dist/leaflet.css";

    .leaflet-pane {
        position: relative;
    }

    .map-field {
        height: 350px;
    }

    .leaflet-pane .leaflet-shadow-pane {
        display: none;
    }
</style>
