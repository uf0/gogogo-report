d3.json('data/routesperteamreduced.json', function(data){

	data.forEach(function(d){
		d.values = d.values.sort(function(a,b){
			return (a.method < b.method) ? -1 : (a.method > b.method) ? 1 : 0;
		})
	})

	var data = data.sort(function(a,b){
		return b.values.length - a.values.length
	})

	var rex = /(<([^>]+)>)/ig;

	var margin = {top: 20, right: 0, bottom: 20, left: 0};

	var width = $("#teamrank").width() - margin.left - margin.right,
		elmHeight = 25,
		height = (data.length * elmHeight + elmHeight) - margin.top - margin.bottom;

	var svg = d3.select("#teamrank").append("svg")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
		.append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	var maxRoutes = d3.max(data, function(d){
		return d.values.length;
	})

	var maxKm = d3.max(data, function(d) {
  					return d3.max(d.values, function(e){ return e.distance});
			});

	var minKm = d3.min(data, function(d) {
  					return d3.min(d.values, function(e){ return e.distance});
			});

	var x = d3.scale.ordinal()
		.domain(d3.range(maxRoutes))
		.rangeBands([0,width-70-20],0)

    var areaScale = d3.scale.log()
                    .domain([minKm, maxKm])
                    .range([50, 1000])

	var colorScale = d3.scale.ordinal()
		.domain(["walking", "public_transport", "bike"])
		.range(["#000", "#424242", "#A4A4A4"])

	var teams = svg.selectAll(".team").data(data)
				.enter().append("g")
				.attr("class","team")
				.attr("transform", function(d,i){
						return "translate(0," + i*elmHeight +")"
					});

	var teamRoute = teams.append("g").attr("class", "routes")
					.attr("transform", function(d,i){
						return "translate(70,0)"
					});

	var teamLegend = teams.append("g").attr("class", "legend")

	var teamButton = teams.append("g").attr("class", "button")
					.attr("transform", function(d,i){
						return "translate(" + (width-20) +",0)"
					});

	teamRoute.append("line")
			 .attr("y1",0)
			 .attr("x1",function(d,i){
			 	return x(d.values.length-1)
			 })
			 .attr("x2",function(d){
			 	return x(maxRoutes-1)
			 })
			 .attr("y2",0)
			 .attr("stroke", "#A4A4A4")
			 .attr("stroke-dasharray", "3,3")

	teamRoute.selectAll("circle")
				.data(function(d){return d.values})
				.enter()
				.append("circle")
				.attr("cx", function(d,i){return x(i);})
				.attr("cy",function(d,i){
					return 0;
				})
				.attr("r", function(d){

					return Math.sqrt((areaScale(d.distance)/Math.PI))
				})
				.attr("fill", function(d){
					return colorScale(d.method)
				})
				.attr("opacity", 0.75)
				.attr("stroke", "white")
				.each(function(d){
					var distance = d3.format('.2f')(d.distance)
					var html = "<b>" + distance + "<i>km</i> </b>by <b>" + d.method.replace("_"," ") + "</b>"
					$(this).tooltip({
					    'container': 'body',
					    'html': true,
					    'title': html
					});
				})


	teamLegend.append("text")
				.text(function(d){ return d.key.replace(rex , "")})
				.attr("font-family", "'Roboto', Arial, sans-serif")
				.attr("font-weight","bold")
				.attr("dy", "4px")


	teamButton.append("circle")
			.attr("r", 11)
			.attr("fill", "#f00")


	teamButton.append("a")
				.attr("xlink:href", function(d){
					return "data/pdf/team_" + d.key + ".pdf"
				})
				.attr("target","_blank")
				.append("text")
				.text("GO!")
				.attr("font-family", "'Roboto', Arial, sans-serif")
				.attr("font-weight","bold")
				.attr("font-size", "0.8em")
				.attr("fill", "#fff")
				.attr("dy", "4px")
				.attr("x", -9)

})
