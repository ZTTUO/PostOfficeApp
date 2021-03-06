/**
 * Created by zhanghuihua on 2016/12/19.
 */
$.fn.extend({
	list: function (options) {
		var op = $.extend({
			pullDown$: 'div.pullDown',
			pullUp$: 'div.pullUp',
			pullDownLabel$: 'span.pullDownLabel',
			pullUpLabel$: 'span.pullUpLabel',
			scroll$: '.scroll',
			refreshFn: function ($pullDown) {
			},
			loadMoreFn: function ($pullUp) {
			}
		}, options);

		return this.each(function () {
			var $wrap = $(this),
				$main = $wrap.find(op.scroll$),
				$pullDown = $wrap.find(op.pullDown$),
				$pullUp = $wrap.find(op.pullUp$),
				$pullDownLabel = $pullDown ? $pullDown.find(op.pullDownLabel$) : null,
				$pullUpLabel = $pullUp ? $pullUp.find(op.pullUpLabel$) : null;

			var $hideBarCtl = $wrap.parentsUnitBox().find('.hideBarCtl');

			var pullDownMsg = {txt: '', flip: ''},
				pullUpMsg = {txt: '', loading: ''};
			if ($pullDownLabel.size() > 0) {
				pullDownMsg = {
					txt: $pullDownLabel.html(),
					flip: $pullDownLabel.attr('data-flip') || 'Release to Refresh'
				};
			}
			if ($pullUpLabel.size() > 0) {
				pullUpMsg = {
					loadMoreTxt: $pullUpLabel.html(),
					noMoreRecordsTxt: '',
					loading: $pullUpLabel.attr('data-loading') || 'Loading...'
				};
			}

			$wrap.scroll({
				scrollX: false,
				scrollY: true,
				scroll$: op.scroll$,
				touchmove: function (event, pos) {
					if ($pullDown.size() > 0) {

						if (pos.scrollY > 60) {
							$pullDown.addClass('flip');
							$pullDownLabel.html(pullDownMsg.flip);
						} else {
							$pullDown.removeClass('flip');
							$pullDownLabel.html(pullDownMsg.txt);
						}
					}

					if ($pullUp.size() > 0) {
						if (pos.scrollY + 30 < -pos.scrollH) {
							$pullUp.addClass('loading');
							$pullUpLabel.html(pullUpMsg.loading);
						} else {
							$pullUp.removeClass('loading');
							$pullUpLabel.html(pullUpMsg.loadMoreTxt);
						}
					}

					if ($hideBarCtl.size() > 0) {
						if (pos.scrollY < -50 && pos.scrollH > 5 && pos.endY > pos.y + 3) {
							$hideBarCtl.addClass('hideBar');
						} else if (pos.endY < pos.y - 3) {
							$hideBarCtl.removeClass('hideBar');
						}
					}

				},
				touchend: function (event, pos) {

					// 列表刷新
					if ($pullDown.size() > 0) {

						if ($pullDown.hasClass('flip')) {
							$pullDown.removeClass('flip').addClass('loading');
							setTimeout(function () {
								$pullDown.removeClass('loading');
							}, 1000);
							op.refreshFn.call($wrap, $pullDown);
						}
					}

					//加载下一页
					if ($pullUp.size() > 0) {
						if ($pullUp.hasClass('loading')) {
							setTimeout(function () {
								$pullUp.removeClass('loading');
								// var currentPos = $main.getComputedPos();
								// if (currentPos.y < -30) $main.translate({y:(currentPos.y+30)+'px', duration:200});
							}, 1000);

							op.loadMoreFn.call($wrap, $pullUp);
						}
					}
				}
			});
		});
	}
});
