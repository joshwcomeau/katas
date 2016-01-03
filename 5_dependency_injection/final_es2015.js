class DI {
  constructor(dependencies) {
    this.dependencies = dependencies;
  }

  inject(func) {
    const param_names = DI.getParams(func);

    const params = param_names
      .map( name => this.dependencies[name] )
      .filter( param => typeof param !== 'undefined');

    return () => func.apply(this, params);
  }

  static getParams(func) {
    const func_string = func.toString();

    const open_parenthesis  = func_string.indexOf('(') + 1;
    const close_parenthesis = func_string.indexOf(')');

    const param_string = func_string.slice( open_parenthesis, close_parenthesis );

    return param_string.replace(/\s/g, '').split(',');
  }
}

export default DI;
