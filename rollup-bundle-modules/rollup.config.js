import commonjs from 'rollup-plugin-commonjs';
import resolve from 'rollup-plugin-node-resolve';
import {terser} from 'rollup-plugin-terser';

export default {
    input: 'stock.js',
    output: [
        {file: 'bundle.js', format: 'iife'},
        {file: 'bundle.min.js', format: 'iife'}
    ],
    plugins: [
        resolve(),
        commonjs(),
        terser({include: [/^.+\.min\.js$/]})
    ]
};
