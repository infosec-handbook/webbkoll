/*! sortable.js 0.8.0 */
(function(){var a,b,c,d,e,f,g;a="table[data-sortable]",d=/^-?[£$¤]?[\d,.]+%?$/,g=/^\s+|\s+$/g,c=["click"],f="ontouchstart"in document.documentElement,f&&c.push("touchstart"),b=function(a,b,c){return null!=a.addEventListener?a.addEventListener(b,c,!1):a.attachEvent("on"+b,c)},e={init:function(b){var c,d,f,g,h;for(null==b&&(b={}),null==b.selector&&(b.selector=a),d=document.querySelectorAll(b.selector),h=[],f=0,g=d.length;g>f;f++)c=d[f],h.push(e.initTable(c));return h},initTable:function(a){var b,c,d,f,g,h,i;if(1===(null!=(i=a.tHead)?i.rows.length:void 0)&&"true"!==a.getAttribute("data-sortable-initialized")){for(a.setAttribute("data-sortable-initialized","true"),f=a.querySelectorAll("th"),c=g=0,h=f.length;h>g;c=++g)d=f[c],"false"!==d.getAttribute("data-sortable")&&e.setupClickableTH(a,d,c),b=d.getAttribute("data-default-sort"),b&&e.sort(d,b);return a}},setupClickableTH:function(a,d,f){var g,h,i,j,k;for(h=function(a){return a.handled===!0?!1:(a.handled=!0,e.sort(a.target))},k=[],i=0,j=c.length;j>i;i++)g=c[i],k.push(b(d,g,h));return k},getColumnType:function(a,b){var c,d,f,g,h,i,j,k,l,m,n;if(d=null!=(l=a.querySelectorAll("th")[b])?l.getAttribute("data-sortable-type"):void 0,null!=d)return e.typesObject[d];for(m=a.tBodies[0].rows,h=0,j=m.length;j>h;h++)for(c=m[h],f=e.getNodeValue(c.cells[b]),n=e.types,i=0,k=n.length;k>i;i++)if(g=n[i],g.match(f))return g;return e.typesObject.alpha},getNodeValue:function(a){var b;return a?(b=a.getAttribute("data-value"),null!==b?b:"undefined"!=typeof a.innerText?a.innerText.replace(g,""):a.textContent.replace(g,"")):""},setupTypes:function(a){var b,c,d,f;for(e.types=a,e.typesObject={},f=[],c=0,d=a.length;d>c;c++)b=a[c],f.push(e.typesObject[b.name]=b);return f},sort:function(a,b){var c,d,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y,z,A,B,C,D,E;for(n=a.parentNode.parentNode.parentNode,p=a.parentNode.querySelectorAll("th"),l="true"===a.getAttribute("data-sorted"),b=b||a.getAttribute("data-sorted-direction"),f=t=0,x=p.length;x>t;f=++t)o=p[f],o.setAttribute("data-sorted","false"),o.removeAttribute("data-sorted-direction"),o===a&&(c=f);if(q=e.getColumnType(n,c),h=l?"ascending"===b?"descending":"ascending":q.defaultSortDirection,a.setAttribute("data-sorted","true"),a.setAttribute("data-sorted-direction",h),m=n.tBodies[0],k=[],l){for(E=m.rows,w=0,A=E.length;A>w;w++)g=E[w],k.push(g);for(k.reverse(),C=0,B=k.length;B>C;C++)j=k[C],m.appendChild(j)}else{for(s=null!=q.compare?q.compare:function(a,b){return b-a},d=function(a,b){return a[0]===b[0]?a[2]-b[2]:q.reverse?s(b[0],a[0]):s(a[0],b[0])},D=m.rows,i=u=0,y=D.length;y>u;i=++u)j=D[i],r=e.getNodeValue(j.cells[c]),null!=q.comparator&&(r=q.comparator(r)),k.push([r,j,i]);for(k.sort(d),v=0,z=k.length;z>v;v++)j=k[v],m.appendChild(j[1])}return"function"==typeof window.CustomEvent&&"function"==typeof n.dispatchEvent?n.dispatchEvent(new CustomEvent("Sortable.sorted",{bubbles:!0})):void 0}},e.setupTypes([{name:"numeric",defaultSortDirection:"descending",match:function(a){return a.match(d)},comparator:function(a){return parseFloat(a.replace(/[^0-9.-]/g,""),10)||0}},{name:"date",defaultSortDirection:"ascending",reverse:!0,match:function(a){return!isNaN(Date.parse(a))},comparator:function(a){return Date.parse(a)||0}},{name:"alpha",defaultSortDirection:"ascending",match:function(){return!0},compare:function(a,b){return a.localeCompare(b)}}]),setTimeout(e.init,0),"function"==typeof define&&define.amd?define(function(){return e}):"undefined"!=typeof exports?module.exports=e:window.Sortable=e}).call(this);

(window).resize(function() {
  var more = document.getElementById("js-navigation-more");
  if ($(more).length > 0) {
    var windowWidth = $(window).width();
    var moreLeftSideToPageLeftSide = $(more).offset().left;
    var moreLeftSideToPageRightSide = windowWidth - moreLeftSideToPageLeftSide;

    if (moreLeftSideToPageRightSide < 330) {
      $("#js-navigation-more .submenu .submenu").removeClass("fly-out-right");
      $("#js-navigation-more .submenu .submenu").addClass("fly-out-left");
    }

    if (moreLeftSideToPageRightSide > 330) {
      $("#js-navigation-more .submenu .submenu").removeClass("fly-out-left");
      $("#js-navigation-more .submenu .submenu").addClass("fly-out-right");
    }
  }
});

$(document).ready(function() {
  var menuToggle = $("#js-mobile-menu").unbind();
  $("#js-navigation-menu").removeClass("show");

  menuToggle.on("click", function(e) {
    e.preventDefault();
    $("#js-navigation-menu").slideToggle(function(){
      if($("#js-navigation-menu").is(":hidden")) {
        $("#js-navigation-menu").removeAttr("style");
      }
    });
  });
});