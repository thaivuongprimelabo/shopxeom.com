<div class="e-tabs not-dqtab ajax-tab-{{ $type }}"  data-section="ajax-tab-{{ $type }}">
	<div class="row row-noGutter">
		<div class="col-sm-12">
			<div class="content">
				<div class="section-title">
					<h2 class="title-head">
						<a href="{{ $route }}" title="{{ $title }}">{{ $title }}</a>
					</h2>
				</div>
				<div>
					@php
						$tabIndex = 1;
					@endphp
					<ul class="tabs tabs-title tab-mobile clearfix hidden-sm hidden-md hidden-lg">
						<li class="prev"><i class="fa fa-angle-left"></i></li>
						<li class="tab-link tab-title hidden-sm hidden-md hidden-lg current tab-titlexs" data-tab="tab-{{ $tabIndex }}">
							<span>{{ trans('shop.all_txt') }}</span>
						</li>
						<li class="next"><i class="fa fa-angle-right"></i></li>
					</ul>
					<ul class="tabs tabs-title ajax clearfix hidden-xs owl-carousel owl-theme tab-product" data-autowidth="true">
						<li class="tab-link has-content" data-tab="tab-{{ $tabIndex }}" data-url="" onclick="return getProductTab('{{ route('get.product.tab') }}', 'all', {{ ProductType::IS_NEW }})">
							<span>{{ trans('shop.all_txt') }}</span>
						</li>
						@if($categories->count())
						@foreach($categories as $key=>$category)
						<li class="tab-link has-content" data-tab="tab-{{ ++$tabIndex }}" data-url="" onclick="return getProductTab('{{ route('get.product.tab') }}', {{ $category->id }}, {{ ProductType::IS_NEW }})">
							<span>{{ $category->name }}</span>
						</li>
						@endforeach
						@endif
						
					</ul>
					<div id="section-tab-{{ $type }}" class="tab-{{ $tabIndex }}">
						<div class="products products-view-grid">

						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>