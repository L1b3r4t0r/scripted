/*******************************************************************************
 * @license
 * Copyright (c) 2012 VMware, Inc. All Rights Reserved.
 * THIS FILE IS PROVIDED UNDER THE TERMS OF THE ECLIPSE PUBLIC LICENSE
 * ("AGREEMENT"). ANY USE, REPRODUCTION OR DISTRIBUTION OF THIS FILE
 * CONSTITUTES RECIPIENTS ACCEPTANCE OF THE AGREEMENT.
 * You can obtain a current copy of the Eclipse Public License from
 * http://www.opensource.org/licenses/eclipse-1.0.php
 *
 * Contributors:
 *     Kris De Volder - initial API and implementation
 ******************************************************************************/

/*global require exports */
var utils = require('../../server/jsdepend/utils');
var toCompareString = toCompareString;
var orMap = utils.orMap;

exports.mapTest1 = function (test) {
	test.equals(toCompareString([10, 20, 30]),
		toCompareString([1, 2, 3].map(function (x) {return x*10; }))
	);
	test.done();
};

function toCompareString(obj) {
	return JSON.stringify(obj, null, '  ');
}

exports.orMapK = function (test) {
	var f = function (x, k) {
		k(x>2 && x*10);
	};
	orMap([1, 2, 3, 4], f, function (result) {
		test.equals(result, 30);
		test.done();
	});
};

exports.orMapKfalse = function (test) {
	var f = function (x, k) {
		k(x>20 && x*10);
	};
	orMap([1, 2, 3, 4], f, function (result) {
		test.equals(result, false);
		test.done();
	});
};

exports.orMapKempty = function (test) {
	var f = function (x, k) {
		k(x>2 && x*10);
	};
	orMap([], f, function (result) {
		test.equals(result, false);
		test.done();
	});
};

exports.pathNormalize = function (test) {
	var normalize = require('../../server/jsdepend/utils').pathNormalize;
	test.equals('/', normalize('////'));
	test.equals('a/b/c', normalize('a/b/c'));
	test.equals('.', normalize('.'));
	test.equals('a/d', normalize('a/b/c/../../d'));
	test.equals('../../foo', normalize('a/b/../../../../foo'));
	test.equals('/a/b', normalize('/a/b'));
	test.equals('/a/b', normalize('/a/b/'));
	test.equals('/a/b', normalize('/a//b'));
	test.equals('/a/b', normalize('///a/b'));
	test.equals('/a/b', normalize('//a/b'));
	test.equals('/a/b', normalize('/a/b'));
	test.done();
};

exports.getDirectory = function (test) {
	var getDir = require('../../server/jsdepend/utils').getDirectory;
	test.equals('/a', getDir('/a/b'));
	test.equals('/', getDir('/a'));
	test.equals(null, getDir('/'));
	test.equals(null, getDir('.'));
	test.equals('.', getDir('foo'));
	test.equals('foo', getDir('foo/bar'));
	test.done();
};

exports.getFileName = function (test) {
	var f = require('../../server/jsdepend/utils').getFileName;
	test.equals(f("foo.txt"), "foo.txt");
	test.equals(f("/ho/ha/hi/foo.txt"), "foo.txt");
	test.done();
};

function logit(f) {
	return function (a, b) {
		var r = f(a,b);
		console.log(f.name + ' ' +JSON.stringify([a, b]) + ' => '+r);
		return r;
	};
}

exports.pathIsPrefixOf = function (test) {
	var f = require('../../server/jsdepend/utils').pathIsPrefixOf;
//	f = logit(f); //To more easily see what the test is actually doing
	//Some tests involving the root path '/'
	test.equals(true, f('/', '/'));
	test.equals(true, f('/', '/foo/bar'));
	test.equals(false, f('/foo/bar', '/'));
	test.equals(true, f('/abc', '/abc'));

	//Some tests involving optional trailing slashes
	test.equals(true, f('/abc', '/abc/def'));
	test.equals(false, f('/abc/def', '/abc'));
	test.equals(true, f('/abc/', '/abc/'));
	test.equals(true, f('/abc',  '/abc'));
	test.equals(true, f('/abc/', '/abc'));
	test.equals(true, f('/abc',  '/abc/'));
	test.equals(false, f('/abc', '/abcdef')); //not path prefix if ended in middled of segment!


	test.done();
};