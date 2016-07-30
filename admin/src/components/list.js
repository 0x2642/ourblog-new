
var List = React.createClass({
  handleClick:function(i){
    this.props.onGetPageData(i)
  },
  viewBtnClick:function(id){
    this.props.onViewClick(id)
  },
  editBtnClick:function(id){
    this.props.onEditClick(id)
  },
  delBtnClick:function(id){
    this.props.onDelClick(id)
  },    
	render:function () {
		return (
          <div className="table-responsive">
            <Table data={this.props.data} statusColor={this.props.statusColor} onViewBtnClick={this.viewBtnClick}  onEditBtnClick={this.editBtnClick}  onDelBtnClick={this.delBtnClick} />
            {this.props.showpage?<ListBtn pagenation={this.props.pagenation} onHandleClick={this.handleClick} />:''}
          </div>
		);
	}

});

var ListBtn = React.createClass({
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

var TableHeader = React.createClass({
  render:function () {
    var header=this.props.data.header;
    var th=[];
    var option=this.props.data.option
    for (var i = 0; i < header.length; i++) {
      th.push(<th>{header[i].name}</th>)
    }
    return (
              <thead>
                <tr>
                  {th}
                  {option==0?'':<th>操作</th>}
                </tr>
              </thead>
    );
  }
});

var TableBody = React.createClass({
  viewClick:function(id){
      this.props.onHandleViewClick(id)
  },  
  editClick:function(id){
      this.props.onHandleEditClick(id)
  },
  delClick:function(id){
      this.props.onHandleDelClick(id)    
  },
  render:function () {
      var cls_ptr=this;
      var status_color_cls=this.props.statusColor
      var row = this.props.data.data.map(function(rows,index) {
        var td=[]
        var option_td=[]
        var header=cls_ptr.props.data.header;
        for (var i=0;i<header.length;i++) {
              var key=header[i].value;
              var val='';
              if (key=="auto_no") {
                val=index+1;
              } else if(key.indexOf('.')>0) {
                  var key_list=key.split('.');
                  var val=rows[key_list[0]]
                  for(var ki=1;ki<key_list.length;ki++){
                    val=val[key_list[ki]]
                  }
              } else{
                val=rows[header[i].value];
              }
              td.push(<td>{val}</td>)
        }

        if ([1,3,5,7].indexOf(cls_ptr.props.data.option)>=0) {
          option_td.push(
                  <div className="btn-group" role="group">
                    <button type="button" className="btn btn-default" onClick={cls_ptr.viewClick.bind(cls_ptr,rows._id)}>
                        <span className="glyphicon glyphicon-eye-open" aria-label="edit"></span>
                    </button>
                  </div>  
            )
        }
        if ([2,3,6,7].indexOf(cls_ptr.props.data.option)>=0) {
          option_td.push(
                  <div className="btn-group" role="group">
                    <button type="button" className="btn btn-default" onClick={cls_ptr.editClick.bind(cls_ptr,rows._id)}>
                        <span className="glyphicon glyphicon-pencil" aria-label="edit"></span>
                    </button>
                  </div>
            )
        }

        if ([4,5,6,7].indexOf(cls_ptr.props.data.option)>=0){
          option_td.push(
                  <div className="btn-group" role="group">
                    <button type="button" className="btn btn-default" onClick={cls_ptr.delClick.bind(cls_ptr,rows._id)}>
                        <span className="glyphicon glyphicon-remove" aria-label="delete"></span>
                    </button>
                  </div>
            )
        } 

      return (
              <tr key={rows._id} className={(status_color_cls && status_color_cls[rows.status])?status_color_cls[rows.status]:''}>
                {td}
                <td>
                <div className="btn-toolbar" role="toolbar" aria-label="tools">      
                  {option_td}
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

var Table = React.createClass({
  handleViewClick:function(id){
    this.props.onViewBtnClick(id)
  },
  handleEditClick:function(id){
    this.props.onEditBtnClick(id)
  },
  handleDelClick:function(id){
    this.props.onDelBtnClick(id)
  },    
  render:function () {
    return (
      <table className="table table-striped">
        <TableHeader data={this.props.data} />
        <TableBody data={this.props.data} statusColor={this.props.statusColor} onHandleViewClick={this.handleViewClick} onHandleEditClick={this.handleEditClick} onHandleDelClick={this.handleDelClick} />
      </table>
    );
  }
});