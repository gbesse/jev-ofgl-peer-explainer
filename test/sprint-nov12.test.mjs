import test from 'node:test';import assert from 'node:assert/strict';
import {peerRatioLedger}from '../src/index.mjs';const options={numerator:'spend',denominator:'population',unit:'EUR/person'};
test('pooled ratio is not average commune ratio',()=>{const x=peerRatioLedger([{id:'small',spend:100,population:10,unit:'EUR/person'},{id:'large',spend:100,population:100,unit:'EUR/person'}],options);assert.equal(x.meanPeerRatio,5.5);assert.equal(x.pooledRatio,200/110);});
test('missing and zero denominator excluded visibly',()=>{const x=peerRatioLedger([{id:'a',spend:100,population:0,unit:'EUR/person'},{id:'b',spend:null,population:10,unit:'EUR/person'}],options);assert.equal(x.eligiblePeers,0);assert.equal(x.pooledRatio,null);assert.deepEqual(x.rows.map(r=>r.reason),['nonpositive_denominator','missing_value']);});
test('mixed units rejected',()=>assert.throws(()=>peerRatioLedger([{id:'a',spend:10,population:2,unit:'USD/person'}],options)));
