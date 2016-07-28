
var ArticleList = React.createClass({
  handleClick:function(i){
    this.props.onGetPageData(i)
  },
	render:function () {
		return (
          <div className="table-responsive">
            <ArticleTable data={this.props.data} statusColor={this.props.statusColor} />
            {this.props.showpage?<ArticleListBtn pagenation={this.props.pagenation} onHandleClick={this.handleClick} />:''}
          </div>
		);
	}

});

var ArticleListBtn = React.createClass({
  getClickPage:function(i){
    this.props.onHandleClick(i)
    return
  },
  render:function () {
    // console.log(this.props.pagenation)
    var btns = [];
    var listPageBtnDisplayNums=5;
    var start=this.props.pagenation.current;
    var end=this.props.pagenation.current+listPageBtnDisplayNums;

    if(end>this.props.pagenation.max){
      end=this.props.pagenation.max;
      start=end-listPageBtnDisplayNums;
    }

    start=start<=0?start+Math.abs(start)+1:start;

    for (var i = start; i <= end; i++) {
        var btn_cls="btn btn-default";
        if (i==this.props.pagenation.current)
            btn_cls+=" active";

        btns.push(<button type="button" onClick={this.getClickPage.bind(this, i)} className={btn_cls}>{i}</button>)
    }
    var prev_page=this.props.pagenation.current-1<1?1:this.props.pagenation.current-1;
    var next_page=this.props.pagenation.current+1>this.props.pagenation.max?this.props.pagenation.max:this.props.pagenation.current+1
    return (
        <div className="panel panel-default">
          <div className="panel-body fr">
            <div className="btn-toolbar" role="toolbar" aria-label="Toolbar with button groups">
              <div className="btn-group" role="group" aria-label="First group">
                <button type="button"  onClick={this.getClickPage.bind(this, 1)} className="btn btn-default">|&lt;</button>
                <button type="button" onClick={this.getClickPage.bind(this, prev_page)}className="btn btn-default">&lt;</button>
              </div>
              <div className="btn-group" role="group" aria-label="Second group">
                {btns}
              </div>
              <div className="btn-group" role="group" aria-label="Third group">
                <button type="button" onClick={this.getClickPage.bind(this, next_page)}className="btn btn-default">&gt;</button>
                <button type="button"  onClick={this.getClickPage.bind(this, this.props.pagenation.max)} className="btn btn-default">&gt;|</button>
              </div>
            </div>
          </div>
        </div>
    );
  }

});

var ArticleTableHeader = React.createClass({
  render:function () {
    return (
              <thead>
                <tr>
                  <th>#</th>
                  <th>标题</th>
                  <th>作者</th>
                  <th>发布时间</th>
                  <th>操作</th>
                </tr>
              </thead>
    );
  }
});

var ArticleTableBody = React.createClass({
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
  render:function () {
      var cls_ptr=this;
      var status_color_cls=this.props.statusColor
      var row = this.props.data.map(function(rows,index) {
      return (
              <tr key={rows._id} className={(status_color_cls && status_color_cls[rows.status])?status_color_cls[rows.status]:''}>
                <td>{index+1}</td>
                <td>{rows.title}</td>
                <td>{rows.author.name}</td>
                <td>{new Date(parseInt(rows.createTime)).toLocaleDateString()}</td>
                <td>
                <div className="btn-toolbar" role="toolbar" aria-label="tools">
                  <div className="btn-group" role="group">
                    <button type="button" className="btn btn-default" onClick={cls_ptr.editClick.bind(cls_ptr,rows._id)}>
                        <span className="glyphicon glyphicon-pencil" aria-label="edit"></span>
                    </button>
                  </div>
                  <div className="btn-group" role="group">
                    <button type="button" className="btn btn-default" onClick={cls_ptr.delClick.bind(cls_ptr,rows._id)}>
                        <span className="glyphicon glyphicon-remove" aria-label="delete"></span>
                    </button>
                  </div>
                </div>
                </td>
              </tr>
      );
    });
    return (
              <tbody>
                {row}
              </tbody>
    );
  }
});

var ArticleTable = React.createClass({
  render:function () {
    return (
      <table className="table table-striped">
        <ArticleTableHeader />
        <ArticleTableBody data={this.props.data} statusColor={this.props.statusColor} />
      </table>
    );
  }
});