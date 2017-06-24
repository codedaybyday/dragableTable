window.onload = function() {
    var table = document.getElementById('#table');
    var list = [
        ['A', 'B', 'C', 'D'],
        [1, 4, 6, 9],
        [2, 5, 7, 10],
        [3, 5, 8, 11]
    ];

    function DragableTable(selector, list) {
        this.table = document.querySelector(selector);
        this.list = list;
        this.posStart = '';
        this.posEnd = '';
        this.init();
    }
    DragableTable.prototype = {
        constructor: 'DragableTable',
        init: function() {
            this.initLayot();
            this.binEvent();
        },
        initLayot: function() {
            let contents = [];
            for (let i = 0, rows = this.list, rowsLen = rows.length; i < rowsLen; i++) {
                contents.push('<tr>');
                for (let j = 0, colLen = rows[i].length; j < colLen; j++) {
                    contents.push('<td draggable="true" pos="' + [i, j].join(',') + '">' + rows[i][j] + '</td>');
                }
                contents.push('</tr>');
            }
            this.table.innerHTML = contents.join('');
        },
        binEvent: function() {
            let tds = this.table.getElementsByTagName('td');
            let _this = this;
            /*for (let i = 0, l = tds.length; i < l; i++) {
                tds[i].ondragover = function(e) {
                    e = window.event || e;
                    let target = e.target || e.srcElement;
                    console.log(target)
                    if (target.tagName == 'TD') {

                    }
                }
            }*/
            this.table.ondragstart = function(e) {
                e = window.event || e;
                let target = e.target || e.srcElement;
                if (target.tagName == 'TD') {
                    _this.posStart = target.getAttribute('pos');
                }
            }
            this.table.ondragenter = function(e) {
                e = window.event || e;
                let target = e.target || e.srcElement;
                if (target.tagName == 'TD') {
                    _this.posEnd = target.getAttribute('pos');
                }
            }
            this.table.ondragend = function(e) {
                e = window.event || e;
                let target = e.target || e.srcElement;
                console.log(_this.posStart, _this.posEnd);
                _this.updateList(_this.testPositon());
            }
        },
        testPositon: function() {
            let pos1 = this.posStart.split(',');
            let pos2 = this.posEnd.split(',');
            let ret = '';
            if (Math.abs(pos1[0] - pos2[0]) == 1 && Math.abs(pos1[1] - pos2[1]) != 1) { //换行
                ret = 0
            } else if (Math.abs(pos1[0] - pos2[0]) != 1 && Math.abs(pos1[1] - pos2[1]) == 1) { //换列
                ret = 1
            } else { //换单元格
                ret = 2;
            }
            return ret;
        },
        updateList: function(type) {
            let pos1 = this.posStart.split(',');
            let pos2 = this.posEnd.split(',');
            switch (type) {
                case 0:
                    this.exchangeRows(pos1, pos2);
                    break;
                case 1:
                    this.exchangeCols(pos1, pos2);
                    break;
                case 2:
                    this.exchangeTds(pos1, pos2);
                    break;
            }
            this.init();
        },
        exchangeRows: function(pos1, pos2) {
            let row1 = pos1[0];
            let row2 = pos2[0];
            let tmpRow = [];
            tmpRow = this.list[row1];
            this.list[row1] = this.list[row2];
            this.list[row2] = tmpRow;
        },
        exchangeCols: function(pos1, pos2) {
            let colLen = this.list[0].length;
            let row1 = colLen - 1 - pos1[1];
            let row2 = colLen - 1 - pos2[1];
            let invertList = this.invertTable();
            let tmpRow = invertList[row1];
            invertList[row1] = invertList[row2];
            invertList[row2] = tmpRow;
            console.log(invertList);
            this.list = this.unInvertTable(invertList);
        },
        exchangeTds: function(pos1, pos2) {
            let tmp = this.list[pos1[0]][pos1[1]];
            this.list[pos1[0]][pos1[1]] = this.list[pos2[0]][pos2[1]];
            this.list[pos2[0]][pos2[1]] = tmp;
        },
        invertTable: function() { //数组倒置
            let retList = [];
            let rowLen = this.list.length;
            let colLen = this.list[0].length;
            //console.log(this.list);
            for (let i = 0; i < colLen; i++) {
                retList[i] = [];
                for (let j = 0; j < rowLen; j++) {
                    retList[i][j] = this.list[j][rowLen - i - 1];
                }
            }
            return retList;
        },
        unInvertTable: function(list) {
            let retList = [];
            let rowLen = list.length;
            let colLen = list[0].length;
            for (let i = 0; i < colLen; i++) {
                retList[i] = [];
                for (let j = 0; j < rowLen; j++) {
                    retList[i][j] = list[rowLen - j - 1][i];
                }
            }
            return retList;
        }

    }
    new DragableTable('#table', list);
}
