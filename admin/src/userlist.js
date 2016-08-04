var compoments_data={
  "header":[
    {
      name:"#",
      value:"auto_no"
    },
    {
      name:"用户名",
      value:"name"
    },
    {
      name:"Email",
      value:"mail"
    },
    {
      name:"最后登录时间",
      value:"login_time"
    },      
  ],
  "data":[],
  "option":6
};
var UserList = React.createClass({
	getInitialState: function() {
    	return {data: compoments_data,pagenation:[],showpage:false};
  	},
  	componentDidMount: function() {
      this.getPageData(1)
  },
  editClick:function(id){
    location.href="/admin/useredit?id="+id
  },
  delClick:function(id){
    $.ajax({
      type:'POST',
      url: "/api/user_del",
      dataType: 'json',
      cache: false,
      data:{id:id},
      success: function(data) {
          if (data.error_code && data.error_code != 0 ) {
              alert(data.msg)
          } else {
              location.href="/admin/userlist"
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
        if(this.props.showpage==1 && data.users.length>0){
          showpage=true;
        }
        var showData=compoments_data;
        showData.data=data.users
        for (var i = showData.data.length - 1; i >= 0; i--) {
              showData['data'][i]['login_time']=new Date(parseInt(showData['data'][i]['login_time'])).toLocaleDateString()
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
  <UserList url="/api/user_list?pagesize=10" showpage="1" statusColor={statusColor} />,
  document.getElementById('container')
);