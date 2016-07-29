var AdminFormInput = React.createClass({
	render:function () {
		return (
      <div className="form-group form-group-lg">
        <label className="col-sm-1 control-label" htmlFor={this.props.data.name}>{this.props.data.title}</label>
        <div className="col-sm-8">
          <input type="text" name={this.props.data.name} id={this.props.data.name} className="form-control" placeholder={this.props.data.title} />
        </div>
      </div>
		);
	}
});

var AdminFormSelect = React.createClass({
  render:function () {
    var option=[];

    for (var i = this.props.data.option.length - 1; i >= 0; i--) {
        option.push(<option value={this.props.data.option[i].value}>{this.props.data.option[i].name}</option>)
    }

    return (
      <div className="form-group form-group-lg">
        <label className="col-sm-1 control-label" htmlFor={this.props.data.name}>{this.props.data.title}</label>
        <div className="col-sm-8">
          <select className="form-control" name={this.props.data.name} id={this.props.data.name}>
            {option}
          </select>
        </div>
      </div>
    );
  }
});