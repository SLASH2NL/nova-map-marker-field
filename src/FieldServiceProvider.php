<?php namespace GeneaLabs\NovaMapMarkerField;

use Illuminate\Support\ServiceProvider;
use Laravel\Nova\Events\ServingNova;
use Laravel\Nova\Nova;

class FieldServiceProvider extends ServiceProvider
{
    public function boot()
    {
        $this->publishes([
            __DIR__ . '/../../dist/vendor' => public_path('vendor'),
        ], 'assets');

        Nova::serving(function (ServingNova $event) {
            Nova::mix('nova-map-marker-field', __DIR__.'/../dist/mix-manifest.json');
        });
    }

    public function register()
    {
        //
    }
}
