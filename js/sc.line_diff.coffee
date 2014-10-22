class ChartLine
	constructor: (options) ->
		@title	 = options.title
		@id		 = options.id
		@id_drag = options.id_drag
		@W		 = options.width ? 1000 
		@H		 = options.height ? 400
		
		@ll		 = options.label_left
		@lb 	 = options.label_bottom;
		@data	 = options.data
		@average = options.average

		@R		 = options.ratio ? 0.618;
		@digit   = options.digit ? 6;
		@Z		 = options.zoom ? (@W/1000);
	drag:->
		do @draw
		w = @R * @W;
		h = @R * @H * 0.2;
		x0 = (1-@R)/2*@W;
		y0 = (1-@R)/2*@H;
		
		paper = Raphael(@id_drag,@W,@H);
		paper.rect(x0,0,w,60).attr({fill: "",stroke: "#ccc"}).toBack();
		left  = paper.image('img/slider.gif',x0,0,10,h);
		right = paper.image('img/slider.gif',x0+w,0,10,h);
			

	draw: ->
		F = Math.pow(10,@digit);
		w = @R * @W;
		h = @R * @H;
		x0 = (1-@R)/2*@W;
		y0 = (1-@R)/2*@H;
		height = @ll.max - @ll.min;
		cali = w / @data.length;

		## init
		paper = Raphael(@id,@W,@H);
		fonts = 'font-weight':'bold','font-family':"'MS Gothic','sans-serif'"
		@ll.max = Number(@ll.max);
		@ll.min = Number(@ll.min);
		@ll.cali ?= 5
		@average[0].color ?= '#0099cc'
		@average[1].color ?= '#ff9900'

		## label top (title)
		paper.text(@W/2,y0/2,@title.string).attr(fonts).attr({fill: '#3366CC','font-size': 16*@Z,'font-weight':'bold'}).attr(@title.option);

		## label left
		for i in [0..@ll.cali]
			y   = y0 + h * (@ll.cali - i) / @ll.cali;
			txt = (@ll.min+(@ll.max-@ll.min)/@ll.cali*i).toFixed(@digit);
			paper.text(x0*3/4,y,txt).attr(fonts).attr({'font-size': 14*@Z,'text-anchor':"end"})	

		## label right
		lr_x = (x0+w)*1.01;
		lr_y = y0;
		for v in @average
			paper.rect(lr_x,lr_y,12*@Z,12*@Z).attr({fill: v.color,stroke: ''});
			paper.text(lr_x+16*@Z,lr_y+6*@Z,v.string).attr(fonts).attr({fill: v.color,'font-size': 14*@Z,'text-anchor':"start"});
			lr_y += 16*@Z;
			
		## label bottom
		lb_y = 1.5*y0+h;
		for i in [0..@lb.length-1]
			x = x0 + w / (@lb.length-1) * i; 
			paper.text(x,lb_y,@lb[i]).attr(fonts).attr({'font-size': 12*@Z});
		
		## grahics : data
		gpath = ""		
		for line,i in @data
			continue unless line[1]
			do =>
				date = line[0]
				value = line[1]
				
				cx = x0 + cali*i+cali/2;
				cy = y0 + (@ll.max-value)/height * h;
				cy_avg0 = y0 + (@ll.max-@average[0].values[i])/height * h;
				cy_avg1 = y0 + (@ll.max-@average[1].values[i])/height * h;
				cv_avg0 = @average[0].string + ':' + @average[0].values[i];
				cv_avg1 = @average[1].string + ':' + @average[1].values[i];

				if gpath then gpath += "L #{cx} #{cy} " else gpath = "M #{cx} #{cy} "
				
				show = ""	
				paper.rect(x0+cali*i,y0,cali,h).attr(
					{fill: "#FFF",'fill-opacity': 0,stroke: ''}
				).mouseover(=>
					txt = '日付:'+date+'\n'+'現在値:'+value+'\n'+ cv_avg0+'\n'+cv_avg1
					show = paper.set(
						paper.circle(cx,cy,4*@Z).attr({fill: '#3366CC',stroke:''}).toBack(),
						paper.circle(cx,cy_avg0,4*@Z).attr({fill: @average[0].color,stroke:''}).toBack(),
						paper.circle(cx,cy_avg1,4*@Z).attr({fill: @average[1].color,stroke:''}).toBack(),
						paper.path("M " + cx + " " + y0 + "L " + cx + " " + (y0+h) ).attr({fill:'#CC0000',stroke:'#CC0000'}).toBack(),
						paper.rect(cx-40*@Z,(y0+h),80*@Z,20*@Z).attr({fill: "#CC0000",stroke:''}),
						paper.text(cx,y0+h+10*@Z,date).attr(fonts).attr({fill:'#FFF','font-size': 12*@Z}),
						paper.rect(cx+15*@Z,cy-40*@Z,120*@Z,80*@Z,5*@Z).attr({fill: '#CC0000',stroke:"#FFF",'stroke-width':2,'fill-opacity': 0.8}),
						paper.text(cx+20*@Z,cy,txt).attr(fonts).attr({'font-size': 12*@Z,'fill':"#FFF",'font-weight':'bold','text-anchor':"start"})
					)
				).mouseout(=>
					show.remove();
				);
		
		paper.path( gpath ).attr({'stroke': '#3366CC','stroke-width':2}).toBack()
				
		## graphics : average
		for avg in @average
			path = ""
			for v,i in avg.values
				continue unless v
				x = x0 + cali*i + cali/2;
				y = y0 + (@ll.max-v)/height * h ; 
				if path then path += "L #{x} #{y} " else path = "M #{x} #{y} "
			paper.path( path ).attr({"stroke":avg.color,"stroke-width":1,'stroke-dasharray':'- '}).toBack();
		

		## backdrop
		for i in [0..@ll.cali]
			x = x0 + w;
			y = y0 + h * i / @ll.cali;
			paper.path("M "+x0+" "+y+" "+"L "+x+" "+y).attr("stroke","#ccc").toBack(); 
