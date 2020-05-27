const path = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const buildPath = path.resolve(__dirname, 'www');

const devServerPort = 8718;

module.exports = {
    devtool: 'inline-source-map',
    entry: './src/index.ts',
    devServer: {
        port: devServerPort,
        public: 'localhost:' + devServerPort,
        host: '0.0.0.0',
        open: true,
        https: true,
        inline: true
    },
    output: {
        publicPath: '',
        path: path.join(__dirname, ''),
        filename: 'dist/[name].min.js',
    },
    resolve: {
        extensions: ['.js', '.ts']
    },
    module: {

        rules: [
            {
                test: /\.ts?$/,
                exclude: /node_modules/,
                loader: 'ts-loader',
            },

            {
                test: /\.json$/,
                loader: 'json-loader'
            },

            {
                test: /\.(scss|css)$/,
                use: [
                    {
                        // creates style nodes from JS strings
                        loader: "style-loader",
                        options: {
                            sourceMap: true
                        }
                    },
                    {
                        // translates CSS into CommonJS
                        loader: "css-loader",
                        options: {
                            sourceMap: true
                        }
                    },
                    {
                        // compiles Sass to CSS
                        loader: "sass-loader",
                        options: {
                            outputStyle: 'expanded',
                            sourceMap: true,
                            sourceMapContents: true
                        }
                    }
                    // Please note we are not running postcss here
                ]
            },

            {
                // Load all images as base64 encoding if they are smaller than 8192 bytes
                test: /\.(png|jpg|gif|obj|fbx|dae|gltf|mtl|ttf|otf|eot|woff|woff2|svg|mp3|mp4|hdr)$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            // On development we want to see where the file is coming from, hence we preserve the [path]
                            name: '[path][name].[ext]?hash=[hash:20]',
                            limit: 1,
                            esModule: false
                        }
                    }
                ]
            }
        ],

    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './index.html',
            inject: true
        })
    ]
};
