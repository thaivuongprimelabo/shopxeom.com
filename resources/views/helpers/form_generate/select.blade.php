<div>
	<select class="form-control" name="{{ $key }}" id="{{ $key }}">
		@if(!empty($empty_text))<option value="">{{ $empty_text }}</option>@endif
		{!! $options !!}
	</select>
</div>