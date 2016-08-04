
var compoments_data=[
	{
		type:"input",
		name:"title",
		title:"Title"
	},
	{
		type:"input",
		name:"description",
		title:"Description"
	},
	{
		type:"input",
		name:"thumb",
		title:"Thumb"
	},
	{
		type:"input",
		name:"tags",
		title:"Tags"
	},
	{
		type:"select",
		name:"status",
		title:"Status",
		option:[
			{
				name:"删除",
				value:"-1"
			},
			{
				name:"发布",
				value:"1"
			},			
			{
				name:"草稿",
				value:"0"
			},
					
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
					<div className="col-sm-9 edit_input" id="content">
					   <script type="text/markdown">###Hello world!</script>
					</div>	
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