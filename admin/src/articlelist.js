
var compoments_data={
  "header":[
    {
      name:"#",
      value:"auto_no"
    },
    {
      name:"标题",
      value:"title"
    },
    {
      name:"作者",
      value:"author.name"
    },
    {
      name:"发布时间",
      value:"createTime"
    },      
  ],
  "data":[],
  "option":6
};

var ArticleList = React.createClass({
	getInitialState: function() {
    	return {data: compoments_data,pagenation:[],showpage:false};
  	},
  	componentDidMount: function() {
      this.getPageData(1)
  },
  editClick:function(id){
    location.href="/admin/articleedit?id="+id
  },
  delClick:function(id){
    $.ajax({
      type:'POST',
      url: "/api/del",
      dataType: 'json',
      cache: false,
      data:{id:id},
      success: function(data) {
          if (data.error_code && data.error_code != 0 ) {
              alert(data.msg)
          } else {
              location.href="/admin/articlelist"
          }
        }
      });
  },    
  getPageData:function(i){
    $.ajax({
      url: this.props.url+"&page="+i,
      dataType: 'json',
      cache: false,
      success: function(data) {
        var showpage=false;
        if(this.props.showpage==1 && data.articles.length>0){
          showpage=true;
        }
        var showData=compoments_data;
        showData.data=data.articles
        for (var i = showData.data.length - 1; i >= 0; i--) {
              showData['data'][i]['createTime']=new Date(parseInt(showData['data'][i]['createTime'])).toLocaleDateString()
        }

        this.setState({data: showData,pagenation:data.pagenation,showpage:showpage});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
	render:function(){
		return (
			<div className="col-sm-9 col-sm-offset-3 col-md-10 col-md-offset-2 main">
	          <h2 class="sub-header">Section title</h2>
	          <List data={this.state.data} onEditClick={this.editClick} onDelClick={this.delClick} onGetPageData={this.getPageData} showpage={this.state.showpage} pagenation={this.state.pagenation} statusColor={this.props.statusColor} />
			</div>
		);
	}
});

var statusColor={"-1":"list-delete","0":"list-draft","1":"list-release"};

ReactDOM.render(
  <ArticleList url="/api/list?pagesize=10&is_auth=1" showpage="1" statusColor={statusColor} />,
  document.getElementById('container')
);