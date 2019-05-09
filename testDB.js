
class DB {

    AND = 'and';
    OR = 'or';
    // IN = 'in'

    constructor(table) {
        this.tableName = table;
        this.sql_where = '';
        this.sql_limit = '';
        this.sql_order = '';
        this.sql_main_op = '';
    }
    check(data) {

    }
    _clear() {
        this.sql_where = '';
        this.sql_limit = '';
        this.sql_order = '';
        this.sql_main_op = '';
        this.tableName = '';
    }
    _query(sql) {
        // const 
        // this.conn.query(sql);
        console.log("sql=>",sql);
        this._clear();
    }

    table(tableName) {
        this.tableName = tableName;
        return this;
    }

    error() {
        throw new Error("未执行table")
    }

    select(fileds) {
        let _fileds = '*';
        if (Array.isArray(fileds) && fileds.length) {
            _fileds = fileds.join(',');
        }
        if (!this.tableName) return this.error();

        const table = this.tableName;

        const sql = `select ${_fileds} from ${table} ${this.sql_where} ${this.sql_order} ${this.sql_limit}`;
        this._query(sql);
    }
    delete() {

    }
    insert() {

    }
    update() {

    }

    limit(cnt) {
        if (typeof cnt != 'number') return;
        this.sql_limit = `limit ${cnt}`;
        return this;
    }

    order(filed, desc) {
        this.sql_order = `order by ${filed} ${desc ? 'DESC' : ''}`;
        return this;
    }
    _fiter(value) {
        return typeof value === 'string' ? `'${value}'` : value
    }
    where(situations, option) {
        if (!Array.isArray(situations)) return '';
        const a = situations.map(item => {
            const { key, op, value } = item;
            const _value = this._fiter(value);
            return ` ${key} ${op} ${_value} `;
        });
        this.sql_where = "where" + a.join(` ${option} `);
        return this;
    }
}

const db = new DB();
db.select();
const db1 = db.table('student').where([{ key: 'age', op: '>', value: 17 }]).select(['sid', 'age', 'score']).order('sid', true).limit(5);
const db1 = db.table('teacher').where([
    { key: 'age', op: 'gt', value: 35 },
    { key: 'name', op: 'like', value: '%卫' }
], DB.OR
).select(['sid', 'age', 'score']).orderBy('sid', true).limit(5);


db.select(['id']);

// select sid,age,score from student where age > 17 order by sid limit 5;
// select * from teacher where age > 35 and name like '%卫'  order by tid limit 2;
// insert into student values(12,'sabd');
// update student set id = 4
// delete from student where id = 6



const fiter = (value) => {
    return typeof value === 'string' ? `'${value}'` : value
}

const deal = (situations, option) => {
    if (!Array.isArray(situations)) return '';
    const a = situations.map(item => {
        const { key, op, value } = item;
        const _value = fiter(value);
        return ` ${key} ${op} ${_value} `;
    });
    return "where " + a.join(` ${option} `);
}

deal([
    { key: 'age', op: '>', value: 35 },
    { key: 'name', op: 'like', value: '%卫' }
], 'or')