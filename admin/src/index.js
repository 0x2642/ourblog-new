
var Index = React.createClass({
	getInitialState: function() {
    	return {data: [],pagenation:[],showpage:false,statusColor:{}};
  	},
  	componentDidMount: function() {
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      cache: false,
      success: function(data) {
      	var showpage=false;
      	if(this.props.showpage==1 && data.articles.length>0){
      		showpage=true;
      	}

        this.setState({data: data.articles,pagenation:data.pagenation,showpage:showpage});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
	render:function(){
		return (
      <div>
			<div className="col-sm-9 col-sm-offset-3 col-md-10 col-md-offset-2 main">
	          <h1 className="page-header">Dashboard</h1>
	          <DashBoard />
			</div>
      <ArticleList data={this.state.data} showpage={this.state.showpage} pagenation={this.state.pagenation} statusColor={this.props.statusColor} />
      </div>
		);
	}
});

var statusColor={"-1":"list-delete","0":"list-draft","1":"list-release"};

ReactDOM.render(
  <Index url="/api/list?pagesize=10&is_auth=1" showpage="0" statusColor={statusColor} />,
  document.getElementById('container')
);