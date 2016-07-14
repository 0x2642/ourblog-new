
var ArticleList = React.createClass({
	render:function () {
		return (
          <div className="table-responsive">
            <ArticleTable data={this.props.data} />
            {this.props.showpage?<ArticleListBtn pagenation={this.props.pagenation} />:''}
          </div>
		);
	}

});

var ArticleListBtn = React.createClass({
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

    start=start<0?end:start;

    for (var i = start; i < end; i++) {
        btns.push(<button type="button" className="btn btn-default">{i}</button>)
    }

    return (
        <div className="panel panel-default">
          <div className="panel-body fr">
            <div className="btn-toolbar" role="toolbar" aria-label="Toolbar with button groups">
              <div className="btn-group" role="group" aria-label="First group">
                <button type="button" className="btn btn-default">|&lt;</button>
                <button type="button" className="btn btn-default">&lt;</button>
              </div>
              <div className="btn-group" role="group" aria-label="Second group">
                {btns}
              </div>
              <div className="btn-group" role="group" aria-label="Third group">
                <button type="button" className="btn btn-default">&gt;</button>
                <button type="button" className="btn btn-default">&gt;|</button>
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
  render:function () {
      var row = this.props.data.map(function(rows,index) {
      return (
              <tr key={rows._id}>
                <td>{index+1}</td>
                <td>{rows.title}</td>
                <td>{rows.author.name}</td>
                <td>{new Date(parseInt(rows.createTime)).toLocaleDateString()}</td>
                <td>
                <div className="btn-toolbar" role="toolbar" aria-label="tools">
                  <div className="btn-group" role="group">
                    <button type="button" className="btn btn-default">
                        <span className="glyphicon glyphicon-pencil" aria-label="edit"></span>
                    </button>
                  </div>
                  <div className="btn-group" role="group">
                    <button type="button" className="btn btn-default">
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
        <ArticleTableBody data={this.props.data} />
      </table>
    );
  }
});