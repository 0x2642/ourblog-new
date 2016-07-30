
var compoments_data=[
	{
		type:"input",
		name:"mail",
		title:"Mail"
	},
	{
		type:"input",
		name:"name",
		title:"Name"
	},
	{
		type:"input",
		name:"avatar",
		title:"Avatar"
	},
	{
		type:"input",
		name:"description",
		title:"Description"
	},
	{
		type:"select",
		name:"status",
		title:"Status",
		option:[
			{
				name:"无效",
				value:"-1"
			},
			{
				name:"有效",
				value:"1"
			}			
		]
	},	
		
];


var Index = React.createClass({
	render:function () {
		var input_list=[];

	    for (var i =0;i<compoments_data.length;i++) {
	    	if (compoments_data[i].type=='input') {
	        	input_list.push(<AdminFormInput data={compoments_data[i]} />)
	    	} else if(compoments_data[i].type=='select') {
	    		input_list.push(<AdminFormSelect data={compoments_data[i]} />)
	    	}
	    }		
		return (
			<div className="col-sm-9 col-sm-offset-3 col-md-10 col-md-offset-2 main">
				<h1 className="page-header">Article</h1>
				<form className="form-horizontal" id="article_form">
					<input type="hidden" name="_id" value="" />
					{input_list}
					<button type="button" id="save_btn" className="btn btn-primary btn-lg col-sm-12">Save</button>						
				</form>
			</div>
		);
	}
});

ReactDOM.render(
  <Index />,
  document.getElementById('container')
);