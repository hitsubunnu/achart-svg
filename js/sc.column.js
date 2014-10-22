/*
 * Package: ChartColumn
 * Version: 0.01 (2012-03-19)
 * Author:  hitsubunnu
 */

function ChartColumn(options) {
	this.title	 = options['title'];
	this.id		 = options['id'];
	this.width	 = options['width'] || 400;
	this.height	 = options['height'] || 400;
	
	this.max	 = options['label_left_max'];
	this.min	 = options['label_left_min'];
	this.l_x 	 = options['label_bottom'];
	this.data	 = options['data'];
	
	this.ratio	 = options['ratio'] || 0.618;
	this.float   = options['float'] || 6;
	this.zoom	 = options['zoom'] || this.width/1000;

	/* debug 
	this.width = 400;
	this.height = 400;
	this.zoom = 400/1000;
	/*/
}

ChartColumn.prototype.draw = function() {
	var W = this.width;
	var H = this.height;
	var R = this.ratio;
	var Z = this.zoom;
	var F = Math.pow(10,this.float);
	var w = R * W;
	var h = R * H;
	var x0 = (1-R)/2*W;
	var y0 = (1-R)/2*H;

	var paper = Raphael(this.id,W,H);

	// label top (title)
	var title = this.title;
	paper.text(W/2,y0/2,title.string).attr(title.option);

	// label left
	var height = this.max - this.min;
	var l_y = new Array(this.max,(this.min+height/4*1),(this.min+height/4*2),(this.min+height/4*3),this.min);
	for(var i=0;i<=4;i++){
		var y   = y0 + h * i / 4;
		var txt = Math.round( l_y[i] * F ) / F;
		paper.text(x0/2,y,txt).attr({'font-size': 16*Z});
	}

	// label right
	var lr_x=(x0+w)*1.01;
	var lr_y = y0;
	for(var i=0;i<this.data.length;i++){
		paper.rect(lr_x,lr_y,12*Z,12*Z).attr({fill: this.data[i].color});
		paper.text(lr_x+44*Z,lr_y+6*Z,this.data[i].string).attr({fill: this.data[i].color,'font-size': 14*Z});
		lr_y += 16*Z;
	}
	
	// label bottom
	var lb_len = this.l_x.length;
	var lb_y = 1.5*y0+h;
	var cali = w / lb_len;
	for(var i= 0;i<lb_len;i++){
		var x = x0 + cali / 2  + cali * i;
		paper.text(x,lb_y,this.l_x[i]).attr({'font-size': 12*Z});
	}
	
	// grahics
	var record = new Array;
	var data_len = this.data.length;
	for(var i=0;i<lb_len;i++){
		for(var j=0;j<this.data.length;j++){
			var values = this.data[j].values;
			var x = x0 + cali * i + cali * 0.2 + cali / data_len * j * 0.6
			var y = y0 + (this.max-values[i])/height * h ; 
			var column = paper.rect(x,y0+h,cali/data_len*0.6,1).attr({fill: this.data[j].color});
			column.animate({x: x,y: y,width: (cali/data_len*0.6),height: ((values[i]-this.min)/height*h),fill: this.data[j].color},1000);
			
			var recordid = i+'-'+j;
			record[recordid] = { x: x, y: y , date: "日付:"+this.l_x[i] , value: this.data[j].string+':'+values[i], color: this.data[j].color };
		    column.node.raphaelid = recordid ;
		
			var show;
			column.node.onmouseover = function(){
				var point = record[ this.raphaelid ];
				show = paper.set(
					paper.rect(point.x,point.y-60*Z,120*Z,50*Z,5*Z).attr({fill: "#FFF"}),
					paper.text(point.x+60*Z,point.y-35*Z,point.date+'\n'+point.value).attr({'font-size': 12*Z})
				);
			}
		    column.node.onmouseout = function(){
	    		show.remove();
			}

		}
	}
	
	// backdrop
	for(var i=0;i<=4;i++){
		var x = x0 + w;
		var y = y0 + h * i / 4;
		
		paper.path("M "+x0+" "+y+" "+"L "+x+" "+y).attr("stroke","#ccc").toBack(); 
	}
}
