var api = 'http://172.16.0.221/qfang-api/api/mobile/tax';
$(function() {
  inputCheck('.js-dcheck', 0);
  inputCheck('.js-dxcheck', 1);
  switchStatus('.js-toggle', 'expanded', null, '1');
  switchStatus('.js-checkbox', 'checked');
  switchStatus('.js-expandbox', 'expanded', null, '1');
  switchStatus('.js-radio', 'checked', '1', null, '1');
});

/*点击切换样式函数*/
function switchStatus(obj, clName, subName, blcokObj, radioStatus) {
  /*点击目标，增加移除类名，同级元素样式处理,显示的div,单选*/
  $(obj).on('click', function() {
    var tagel = $(this).parent();
    if (tagel.hasClass(clName)) {
      if (radioStatus) {
        return;
      }
      tagel.removeClass(clName);
      if (blcokObj) {
        tagel.siblings('.expand-box').hide();
      }
    } else {
      tagel.addClass(clName);
      if (subName) {
        tagel.parent().siblings().find(obj).parent().removeClass(clName);
      }
      if (blcokObj) {
        tagel.siblings('.expand-box').show();
      }
    }
  });
}
/*input 输入*/
function inputCheck(obj, status) {
  $(obj).on('input propertychange', function() {
    /*限制整数的*/
    if (status < 1) {
      this.value = this.value.replace(/[^\d]/g, '');
    } else {
      /*限制整小数的*/
      this.value = this.value.replace(/[^\d+\.?\d]/g, '');
    }
  });
}
/*数字格式化*/
function formatNumber(num, cent, isThousand) {
  num = num.toString().replace(/\$|\,/g, '');
  if (isNaN(num)) //检查传入数值为数值类型.
    num = "0";
  if (isNaN(cent)) //确保传入小数位为数值型数值.
    cent = 0;
  cent = parseInt(cent);
  cent = Math.abs(cent); //求出小数位数,确保为正整数.
  if (isNaN(isThousand)) //确保传入是否需要千分位为数值类型.
    isThousand = 0;
  isThousand = parseInt(isThousand);
  if (isThousand < 0)
    isThousand = 0;
  if (isThousand >= 1) //确保传入的数值只为0或1
    isThousand = 1;
  sign = (num == (num = Math.abs(num)));
  num = Math.floor(num * Math.pow(10, cent) + 0.50000000001);
  cents = num % Math.pow(10, cent);
  num = Math.floor(num / Math.pow(10, cent)).toString();
  cents = cents.toString();
  while (cents.length < cent) {
    cents = "0" + cents;
  }

  if (isThousand == 0 && cent != 0)
    return (((sign) ? '' : '-') + num + '.' + cents);
  if (isThousand == 0 && cent == 0)
    return (((sign) ? '' : '-') + num);
  //对整数部分进行千分位格式化.
  for (var i = 0; i < Math.floor((num.length - (1 + i)) / 3); i++)
    num = num.substring(0, num.length - (4 * i + 3)) + ',' +
    num.substring(num.length - (4 * i + 3));
  if (cent == 0) {
    return (((sign) ? '' : '-') + num);
  } else {
    return (((sign) ? '' : '-') + num + '.' + cents);
  }
}
/* 使用方法 var x = formatNumber('100666600.134566666', 2, 1);*/
/*getQuery查询*/
function getQuery(p) {
  var reg = new RegExp("(^|&)" + p + "=([^&]*)(&|$)", "i");
  var r = window.location.search.substr(1).match(reg);
  return r ? decodeURI(r[2]) : null;
}
/*提示消息*/
function showmsg(msg) {
  var box = document.createElement("div");
  box.className = "msg-box";
  var content = document.createElement("div");
  content.className = "msg-con";
  box.appendChild(content);
  content.innerHTML = msg;
  document.body.appendChild(box);
  $(box).animate({
    opacity: 1
  }, 300, function() {}).animate({
    opacity: 1
  }, 3000, function() {}).animate({
    opacity: 0
  }, 300, function() {
    $(box).remove();
  });
}

/*取session*/
function setInfo(resultInfo) {
  var infoObj = resultInfo.calculateResult;
  $('#initialCharges').text(formatNumber(infoObj.initialCharges, 0, 1));
  $('#loan').text(formatNumber(infoObj.loan, 0, 1));
  $('#yearPeriod').text(infoObj.yearPeriod);
  $('#period').text(infoObj.period);
  $('#xyPeriod').html(infoObj.xPeriod + '-' + infoObj.yPeriod);
  $('#xyInterestRate').text(formatNumber(infoObj.xyInterestRate, 2, 0));
  $('#xyMonthlyPayment').text(formatNumber(infoObj.xyMonthlyPayment, 0, 1));
  if (infoObj.aPeriod && infoObj.bPeriod && infoObj.abMonthlyPayment) {
    $('#abPeriod').html(infoObj.aPeriod + '-' + infoObj.bPeriod);
    $('#abInterestRate').text(formatNumber(infoObj.abInterestRate, 2, 0));
    $('#abMonthlyPayment').text(formatNumber(infoObj.abMonthlyPayment, 0, 1));
    $('#otherYearInfo').show();
    $('#otherRateInfo').show();
  } else {
    $('#otherYearInfo').hide();
    $('#otherRateInfo').hide();
  }
  $('#totalInterest').text(formatNumber(infoObj.totalInterest, 0, 1));
  $('#minimumMonthlyIncome').text(formatNumber(infoObj.minimumMonthlyIncome, 0, 1));
  if (infoObj.mortgagePremium) {
    $('#mortgagePremium').text(formatNumber(infoObj.mortgagePremium, 0, 1));
    $('#insureInfo').show();
  } else {
    $('#insureInfo').hide();
  }

}
/*读取session href*/
$(function() {
  /*放入本地存储*/
  var urlInfo = '?sessionId=' + sessionId + '&userId=' + userId + '&version=' + version;
  $('#linkIntro').attr('href', '/qfang-api/api/mobile/tax/mortgageCalculateInstruction' + urlInfo);
  /*  var linkHtml = '<li><a href="/qfang-api/api/mobile/tax/mortgageCalculateExpend' + urlInfo + '">支出一覽</a></li><li> <a href="/qfang-api/api/mobile/tax/mortgageCalculateContribution' + urlInfo + '">供款列表</a></li><li> <a href="/qfang-api/api/mobile/tax/mortgageCalculatePlan' + urlInfo + '">按揭計劃</a></li>';*/
  var linkHtml = '<li><a href="expend.html' + urlInfo + '">支出一覽</a></li><li> <a href="contribution.html' + urlInfo + '">供款列表</a></li><li> <a href="mortgage_plan.html' + urlInfo + '">按揭計劃</a></li>';
  $('#btnList').append(linkHtml);


});
var userId = getQuery('userId');
var version = getQuery('version');
var sessionId = getQuery('sessionId');
function urlInfo() {
  var urlInfo = '?sessionId=' + sessionId + '&userId=' + userId + '&version=' + version; 
  return urlInfo;
}

function ctrlLink() {
  var linkHtml = '<li><a href="javascript:;" id="expendLink">支出一覽</a></li><li> <a href="javascript:;" id="listLink">供款列表</a></li><li> <a href="javascript:;" id="planLink">按揭計劃</a></li>';
  return linkHtml;
}
function clickLink(el, tagLink) {
  $(el).on('click', function() {
    location.replace(tagLink);
  });
}
function infoList(urlInfo) {
  clickLink('#expendLink', 'expend.html' + urlInfo);
  clickLink('#planLink', 'mortgage_plan.html' + urlInfo);
  clickLink('#listLink', 'contribution.html' + urlInfo); 
  /*clickLink('#expendLink', '/qfang-api/api/mobile/tax/mortgageCalculateExpend' + urlInfo);
  clickLink('#planLink', '/qfang-api/api/mobile/tax/mortgageCalculatePlan' + urlInfo);
  clickLink('#listLink', '/qfang-api/api/mobile/tax/mortgageCalculateContribution' + urlInfo);*/
}