@extends('layouts.error')
@section('content')
{!! \App\Page::find(5)->content !!}
@endsection

