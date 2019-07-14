@extends('layouts.error')
@section('content')
{!! \App\Page::find(6)->content !!}
@endsection

