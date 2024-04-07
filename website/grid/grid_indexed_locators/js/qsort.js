// JavaScript Document
function initqsort(ctableid) {
eval("document.getElementById(\""+ctableid+"\").qs=new qsortObject(arguments)");
document.getElementById(ctableid).qs.initclicks();
}
function qsortObject(args /*ctableid,crowonclassname,crowoffclassname ,boolIgnoreLastRow,boolIgnoreCase */) {
	var ctableid=args[0];
	var crowonclassname=(args.length>1) ? args[1] : "";
	var crowoffclassname=(args.length>2) ? args[2] : "";
	var boolIgnoreLastRow=(args.length>3) ? args[3] : false;
	var boolIgnoreCase=(args.length>4) ? args[4] : false;
	this.otable=document.getElementById(ctableid);
	var o=this.otable;
	if (o) {
		this.cursor=(document.body.cursor) ? document.body.cursor : "";
		this.orows=o.rows;
		this.startrow=1;
		this.endrow=((boolIgnoreLastRow) ? this.orows.length-2 : this.orows.length-1);
		this.ignorecase=boolIgnoreCase;
		this.ncols=o.rows[0].cells.length;
		this.cclasson=crowonclassname;
		this.cclassoff=crowoffclassname;
		this.parray=new Array(this.endrow-this.startrow+1);
		this.sorttype="string";
		this.direction="ASCEND";
		this.sortcol=0;
		this.itimeout=0;
		this.descimage="";
		this.ascimage="";
		this.afirstdirection="";
		this.ctableid=ctableid;
		this.spacer="..................................................";
		this.delimchar="|";
		}
	else {return;}
	this.initpointerarray=function() {
		this.cleartime();
		var a,o,o2,n,j,k,c
		for (var i=0;i<this.parray.length;i++) {
			this.parray[i]=this.format(this.orows[this.startrow+i].cells[this.sortcol].innerHTML)+i;
			}
		c=this.parray.sort();
		for (i=0;i<c.length;i++) {
			n=(c[i].substr(c[i].indexOf(this.delimchar)+1)*1);
			a=new Array(this.ncols);
			for (j=0;j<this.ncols;j++) {
				a[j]=this.orows[n+this.startrow].cells[j].innerHTML;
				}
			this.parray[i]=a;
			}
		if (this.direction==="ASCEND") {
			for (i=0;i<this.parray.length;i++) {
				o=this.orows[i+this.startrow];
				o2=this.parray[i];
				for (j=0;j<this.ncols;j++) {
					o.cells[j].innerHTML=o2[j];
					}
				}
			}
		else {
			k=0;
			for (i=this.endrow;i>=this.startrow;i--) {
				o=this.orows[i];
				o2=this.parray[k++];
				for (j=0;j<this.ncols;j++) {
					o.cells[j].innerHTML=o2[j];
					}
				}
		}
		var cimageurl=(this.direction==="ASCEND") ? this.ascimage : this.descimage;
		if (cimageurl) {
			cimageurl="url("+cimageurl+")";
			for (i=0;i<this.orows[0].cells.length;i++) {
				this.orows[0].cells[i].style.backgroundImage=(i===this.sortcol) ? cimageurl : "";
			}
		}
		document.body.style.cursor=this.cursor;
		this.orows[0].cells[this.sortcol].style.cursor=this.colcursor;
		this.resetdirections(this.sortcol);
		this.itimeout=setTimeout(this.ctableid+".qs.cleartime()",0);
	};
	this.format=function(cstring) {
		var s,a,d;
		switch (this.sorttype) {
			case "string" :
				s=((this.ignorecase) ? cstring.toLowerCase() : cstring)+this.spacer;
				s=s.substr(0,this.spacer.length);
				break;
			case "numeric" :
				s=parseFloat(cstring);
				if (isNaN(s)) {s=0.0000;}
				s=s+"";
				a=s.split(".");
				d=((a.length>1) ? a[1] : "")+"00000";
				s=a[0]+"."+d.substr(5);
				s=this.spacer.substr(0,this.spacer.length-s.length)+s;
				break;
			case "date" :
				s=new Date(cstring);
				if (isNaN(s)) {
					s=cstring+this.spacer;
					}
				else {
					var m=(s.getMonth()+1)+"";
					m=(m.length<2) ? ("0"+m) : m;
					var d=s.getDate()+"";
					d=(d.length<2) ? ("0"+d) : d;
					var hr=s.getHours()+"";
					hr=(hr.length<2) ? ("0"+hr) : hr;
					var mn=s.getMinutes()+"";
					mn=(mn.length<2) ? ("0"+mn) : mn;
					var sc=s.getSeconds()+"";
					sc=(sc.length<2) ? ("0"+sc) : sc;
					s=s.getFullYear()+m+d+hr+mn+sc+this.spacer;
					}
				s=s.substr(0,this.spacer.length);
				break;
			default:
				s=cstring+this.spacer;
				s=s.substr(0,this.spacer.length);
				break;
			}
		return (s+this.delimchar);
		};
	this.qsort=function(ncol /*,boolSortDescending */) {
		document.body.style.cursor="wait";
		var n;
		this.sorttype="";
		try {
				n=new Date(this.orows[this.startrow].cells[ncol].innerHTML);
				this.sorttype=(isNaN(n)) ? "" : "date";
			}
			catch(e) {n=false;}
		if (this.sorttype.length===0) {
			try {
				n=(!isNaN(parseFloat(this.orows[this.startrow].cells[ncol].innerHTML)) && this.orows[this.startrow].cells[ncol].innerHTML.indexOf("-")<0);
				this.sorttype=(n) ? "numeric" : "";
				}
			catch(e) {n=false;}
		}
		if (this.sorttype.length===0) {this.sorttype="string";}
		this.direction=((arguments.length>-2) ? ((arguments[1]) ? "DESC" : "ASCEND") : "ASCEND");
		if (!this.orows[0].cells[ncol].direction) {
			this.orows[0].cells[ncol].direction=this.direction;
		}
		else {
			this.direction=(this.orows[0].cells[ncol].direction==="DESC") ? "ASCEND" : "DESC";
			this.orows[0].cells[ncol].direction=this.direction;
		}
		this.sortcol=ncol;
		this.colcursor=this.orows[0].cells[ncol].style.cursor;
		this.orows[0].cells[ncol].style.cursor="wait";
		this.itimeout=setTimeout(this.ctableid+".qs.initpointerarray()",0);
	};
	this.cleartime=function() {
		if (this.itemout) {clearTimeout(this.itimeout);}
		this.itimeout=0;
	};
	this.initdirection=function(cdirectionlist) {
		this.afirstdirection=cdirectionlist.split(",");
		this.resetdirections();
	};
	this.resetdirections=function(/* nskipcolumn */) {
		if (!this.afirstdirection) {return;}
		var skipcol=(arguments.length>0) ? arguments[0] : -1;
		for (var i=0;i<this.orows[0].cells.length;i++) {
			if (i!==skipcol) {
				this.orows[0].cells[i].direction=this.afirstdirection[i];
			}
		}
	};
	this.initclicks=function() {
		for (var i=0;i<this.orows[0].cells.length;i++) {
			this.orows[0].cells[i].cellnum=i;
			this.orows[0].cells[i].onclick=function() {this.parentNode.parentNode.parentNode.qs.qsort(this.cellnum);};
		}
	};
}
