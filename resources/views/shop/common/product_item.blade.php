<div class="col-xs-6 col-xss-6 col-sm-4 col-md-3 col-lg-3">
    <div class="product-box">															
        <div class="product-thumbnail flexbox-grid">	
            <a href="{{ $product->getLink() }}" title="{{ $product->getName() }}">
                <img src="{{ $product->getFirstImage('medium') }}"  data-lazyload="{{ $product->getFirstImage('medium') }}" alt="{{ $product->getName() }}">
            </a>
            {!! $product->getDisCount() !!} 	
            <div class="product-action hidden-md hidden-sm hidden-xs clearfix">
                <form action="?" method="post" class="variants form-nut-grid margin-bottom-0" enctype="multipart/form-data">
                    <div>
                        <input type="hidden" name="variantId" value="17898181" />
                        @include('shop.common.button_add_to_cart')
                        <a href="{{ $product->getLink() }}" class="btn-gray btn_view btn right-to">
                            <i class="fa fa-eye"></i>
                        </a>
                    </div>
                </form>
            </div>
        </div>
        <div class="product-info a-center">
            <h3 class="product-name"><a href="{{ $product->getLink() }}" title="{{ $product->getName() }}">{{ $product->getName() }}</a></h3>
            @include('shop.common.price_box')
        </div>
    </div>
</div>