/* eslint-disable */

import { MessageBox } from "element-ui"

function getLodop() {
  return document.iFramePrint.window.getLodop(null, null);
}
function setCLodopCallback(cb) {
  document.iFramePrint.window.setCLodopCallback(cb);
}
function CreateOneFormPage(fields, bgImageUrl) {
  let LODOP = getLodop();
  LODOP.PRINT_INIT("运单套打");
  LODOP.SET_PRINT_MODE("PROGRAM_CONTENT_BYVAR",true);
  fields.forEach((field, index) => {
    LODOP.ADD_PRINT_TEXT(index * 30, 30, 200, 30, field.showName + ':' + index);
  });
  if (bgImageUrl) {
    LODOP.ADD_PRINT_SETUP_BKIMG("<img border='0' src='" + bgImageUrl + "'>");
  }
  LODOP.SET_SHOW_MODE("BKIMG_IN_PREVIEW",1);
}

const COMMAND_PREFIX = "LODOP.";
const COMMAND_METHOD_PRINT_TEXT = "ADD_PRINT_TEXT";
const COMMAND_METHOD_BARCODE = "ADD_PRINT_BARCODE";

function parse(content) {
  // console.log('origin', content);
  const lines = content.split(/\r?\n/);
  const result = [];
  lines.forEach((line) => {
    // console.log('origin line', line.length, line);
    if (line && line.length > 0) {
      const start = COMMAND_PREFIX.length,
        stop = line.indexOf('(');
      const method = line.substr(start, stop - start);
      const params = line.substr(stop + 1, line.indexOf(')') - stop - 1);
      // console.log('method', method, 'params', params);
      const args = params.split(',');
      result.push({method: method, parameters: args});
    }
  });
  // console.log('result', result);
  return result;
}

function toCommandLine(method) {
  return COMMAND_PREFIX + method.method + '(' + method.parameters.join(',') + ');';
}

function getFieldIndexByShowName(fields, showName) {
  for (var i = 0; i < fields.length; i ++ ) {
    if (fields[i].showName === showName)
      return i;
  }
  return -1;
}

function toVariableTemplate(TaskID, template, fields, callback) {
  const result = [];
  const methods = parse(template);
  methods.forEach((method) => {
    if (method.method === COMMAND_METHOD_PRINT_TEXT) {
      const params = method.parameters;
      if (params.length === 5 && params[4].indexOf('$') >= 0) {
        let variable = params[4];
        variable = variable.replace(/\"/g, '');
        variable = variable.replace(/\$/g, '');
        const index = getFieldIndexByShowName(fields, variable);
        params[4] = '"$' + fields[index].fieldConfigCode + '$"';
      }
    }
    result.push(toCommandLine(method));
  });
  console.log('return', result);
  var sep = '\r' + '\n';
  callback(result.join(sep));
}

function getFieldIndex(fields, fieldConfigCode) {
  for (var i = 0; i < fields.length; i ++) {
    if (fields[i].fieldConfigCode === fieldConfigCode)
      return i;
  }
  return -1;
}

function merge(originFields, template, qrcodeField) {
  const fields = [];
  originFields.forEach((f) => {
    fields.push(f);
  });
  const methods = template ? parse(template) : [];
  let qrcodeFounded = false;
  const newCommandLines = [];
  methods.forEach((method) => {
    // console.log('method', method);
    if (method.method === COMMAND_METHOD_PRINT_TEXT) {
      const params = method.parameters;
      if (params.length === 5 && params[4].indexOf('$') >= 0) {
        let variable = params[4];
        variable = variable.replace(/\"/g, '');
        variable = variable.replace(/\$/g, '');
        const fieldIndex = getFieldIndex(fields, variable);
        if (fieldIndex >= 0) {
          params[4] = '"$' + fields[fieldIndex].showName + '$"';
          newCommandLines.push(toCommandLine(method));
          fields.splice(fieldIndex, 1);
        }
      } else {
        newCommandLines.push(toCommandLine(method));
      }
    } else if (method.method === COMMAND_METHOD_BARCODE) {
      const params = method.parameters;
      let variable = params[5];
      variable = variable.replace(/\"/g, '');
      variable = variable.replace(/\$/g, '');
      console.log('qrcode', variable, qrcodeField);
      if (variable === qrcodeField) {
        newCommandLines.push(toCommandLine(method));
        qrcodeFounded = true;
      }
    } else {
      newCommandLines.push(toCommandLine(method));
    }
  });
  if (qrcodeFounded === false && qrcodeField) {
    // LODOP.ADD_PRINT_BARCODE(fields.length * 30, 30, 100, 100, "QRCode", "$" + qrcodeField + "$");
    const m = {
      method: COMMAND_METHOD_BARCODE,
      parameters: [fields.length * 30, 30, 100, 100, '"QRCode"', '"$' + qrcodeField + '$"']
    };
    newCommandLines.push(toCommandLine(m));
  }
  fields.forEach((f, index) => {
    const m = {
      method: COMMAND_METHOD_PRINT_TEXT,
      parameters: [index * 30, 30, 200, 30, '"$' + f.showName + '$"']
    };
    newCommandLines.push(toCommandLine(m));
  });
  var sep = '\r' + '\n';
  return newCommandLines.join(sep);
}


function updateFormPage(fields, newFields, oldTemplate) {
  console.log('fields', fields);
  console.log('oldTemplate', oldTemplate);
  let LODOP = getLodop();
  eval(oldTemplate);
  var counter = 0;
  fields.forEach((field, index) => {
    const found = newFields.find(f => f.fieldConfigCode === field.fieldConfigCode);
    console.log('found', found);
    if (found) {
      console.log('add', field);
      LODOP.ADD_PRINT_TEXT(counter * 30, 30, 200, 30, field.showName + ':' + index);
      counter ++;
    }
  });
}
function designTemplate(width, height, fields, bgImageUrl, oldTemplate, qrcodeField, callback) {
    // var context = document.getElementById('contextId').value;
  const commandLines = merge(fields, oldTemplate, qrcodeField);
  console.log('design', commandLines);

  let LODOP = getLodop();
  if (typeof(LODOP) == "undefined") {
      turnDownLoadUrl();
      return;
  }

  if (!oldTemplate) {
    LODOP.PRINT_INIT("套打模版");
    LODOP.SET_PRINT_PAGESIZE(width, height);
    LODOP.SET_PRINT_MODE("PROGRAM_CONTENT_BYVAR",true);
  }
  console.log('bgImageUrl', bgImageUrl);
  if (bgImageUrl) {
    LODOP.SET_SHOW_MODE("BKIMG_IN_PREVIEW",true);
    LODOP.ADD_PRINT_SETUP_BKIMG("<img border='0' src='" + bgImageUrl + "'>");
  }

  eval(commandLines);

  if (LODOP.CVERSION) {
    setCLodopCallback((TaskID, Value) => {
      console.log('lodop return', Value);
      toVariableTemplate(TaskID, Value, fields, callback);
    });
  }
  const newTemplateId = LODOP.PRINT_DESIGN();
  console.log('lodop newTemplateId', newTemplateId);
  // callback(newTemplate);
}

function previewDocument(fields, bgImageUrl, oldTemplate, qrcodeField) {

  const commandLines = merge(fields, oldTemplate, qrcodeField);
  console.log('preview', commandLines);

  let LODOP = getLodop();
  if (typeof(LODOP) == "undefined") {
    turnDownLoadUrl();
    return;
  }

  eval(commandLines);

  if (bgImageUrl) {
    LODOP.SET_SHOW_MODE("BKIMG_IN_PREVIEW",true);
    LODOP.ADD_PRINT_SETUP_BKIMG("<img border='0' src='" + bgImageUrl + "'>");
  }
  if (LODOP.CVERSION) {
    // CLODOP.On_Return = null;
    setCLodopCallback(null);
  }
  LODOP.PREVIEW();
}

function printDocument(fields, qrcodeField, contents, businessObject) {
  const result = [];
  const methods = contents ? parse(contents) : [];
  methods.forEach((line) => {
    if (line.method === COMMAND_METHOD_PRINT_TEXT) {
      const params = line.parameters;
      if (params.length === 5 && params[4].indexOf('$') >= 0) {
        let variable = params[4];
        variable = variable.replace(/\"/g, '');
        variable = variable.replace(/\$/g, '');
        params[4] = (variable in businessObject) ? '"' + businessObject[variable] + '"' : '""';
        result.push(toCommandLine(line));
      } else {
        result.push(toCommandLine(line))
      }
    } else if (line.method === COMMAND_METHOD_BARCODE) {
      const params = line.parameters;
      let variable = params[5];
      variable = variable.replace(/\"/g, '');
      variable = variable.replace(/\$/g, '');
      if (variable in businessObject) {
        params[5] = '"' + businessObject[variable] + '"';
        result.push(toCommandLine(line));
      }
    } else {
      result.push(toCommandLine(line))
    }
  });
  const sep = '\r' + '\n';
  const commands = result.join(sep);
  console.log('print', commands);

  try {
    let LODOP = getLodop();
    if (!LODOP || typeof(LODOP) == "undefined") {
      turnDownLoadUrl();
      return;
    }
    eval(commands);
    LODOP.PREVIEW();
  } catch (e) {
    console.error('get lodop error', e);
    turnDownLoadUrl();
  }
}

function getPx(size){
    var result = parseInt(size * 3.8);
    return result;
}

function turnDownLoadUrl() {
  MessageBox({
        title: "下载提示",
        message: "你还没有安装打印控件，请点击立即下载按钮，下载并安装",
        showCancelButton: true,
        confirmButtonText: '立即下载',
        cancelButtonText: '取消',
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            window.open("http://download2.rltx.com/Lodop6.222_CLodop3.043.zip");
          }
          done();
        }
    });
}

function get64CPU(){
    var agent = navigator.userAgent.toLowerCase();
    if(agent.indexOf("win64")>=0 || agent.indexOf(("wow64")>=0)){
        return true;
    }
    return false;
}

export { designTemplate, previewDocument, printDocument };

/* eslint-enable */
