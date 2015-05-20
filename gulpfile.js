var gulp         = require('gulp');
var webpack      = require('webpack');
var gulpWebpack  = require('gulp-webpack');
var webpackServer= require('webpack-dev-server');
var concat       = require('gulp-concat');
var sass         = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var minifycss    = require('gulp-minify-css');
var jshint       = require('gulp-jshint');
var uglify       = require('gulp-uglify');
var imagemin     = require('gulp-imagemin');
var rename       = require('gulp-rename');
var concat       = require('gulp-concat');
var notify       = require('gulp-notify');
var cache        = require('gulp-cache');
var plumber      = require('gulp-plumber');
var del          = require('del');
var path         = require("path");
var assign       = require("object-assign");

var webpackConfig= {
	devtool: 'eval',
	entry: [
		'webpack-dev-server/client?http://localhost:3000',
		'webpack/hot/only-dev-server',
		'./src/js/main.jsx'
	],
	output: {
		path: path.join(path.join(__dirname, 'dist'), 'js'),
		filename: 'mist.js',
		publicPath: '/js/'
	},
	plugins: [
		new webpack.HotModuleReplacementPlugin(),
		new webpack.NoErrorsPlugin()
	],
	resolve: {
		extensions: ['', '.js', '.jsx']
	},
	module: {
		loaders: [
			{ test: /\.js$/, loaders: ['react-hot', 'jsx?harmony'], exclude: /node_modules/ },
			{ test: /\.jsx$/, loaders: ['react-hot', 'jsx?harmony'], exclude: /node_modules/ },
			{ test: /\.scss$/, loader: "style!css!sass?outputStyle=expanded&" +
										"includePaths[]=" +
										(path.resolve(__dirname, "./bower_components")) + "&" +
										"includePaths[]=" +
										(path.resolve(__dirname, "./node_modules"))},
		]
	}
};


gulp.task('webpack', function(){
	return gulp.src('src/js/main.jsx')
				.pipe(plumber())
				.pipe(gulpWebpack({module: webpackConfig.module}, webpack))
				.pipe(concat('mist.js'))
				.pipe(plumber.stop())
				.pipe(gulp.dest('dist/js'));
})

gulp.task('server', function() {
	var myConfig = Object.create(webpackConfig);
	myConfig.devtool = "eval";
	myConfig.debug = true;

	new webpackServer(webpack(myConfig), {
		publicPath: myConfig.output.publicPath,
		contentBase: path.join(__dirname, 'dist'),
		hot: true
	}).listen(3000, 'localhost', function (err, result) {
		if (err) {
			console.log(err);
		}

		console.log('Listening at localhost:3000');
	});
});

gulp.task('js', function() {
	return gulp.src('src/js/**/*.js')
				.pipe(jshint('.jshintrc'))
				.pipe(jshint.reporter('default'))
				.pipe(concat('main.js'))
				.pipe(gulp.dest('dist/assets/js'))
				.pipe(rename({suffix: '.min'}))
				.pipe(uglify())
				.pipe(gulp.dest('dist/assets/js'))
				.pipe(notify({ message: 'Scripts task complete' }));
});

gulp.task('css', function() {
	return gulp.src('src/css/*')
				.pipe(plumber())
				.pipe(sass({ errLogToConsole: true }))
				.pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1'))
				.pipe(concat('style.css'))
				.pipe(gulp.dest('dist/css'))
				.pipe(rename({suffix: '.min'}))
				.pipe(minifycss())
				.pipe(plumber.stop())
				.pipe(gulp.dest('dist/css'));
});

gulp.task('clean', function(cb) {
	del(['dist'], cb)
});

gulp.task('html', function(){
	return gulp.src('src/index.html')
				.pipe(gulp.dest('dist'));
});

gulp.task('images', function(){
	return gulp.src('src/images/*')
				.pipe(gulp.dest('dist/images'));
});

gulp.task('fonts', function(){
	return gulp.src('src/fonts/*')
				.pipe(gulp.dest('dist/fonts'));
});

gulp.task('default', ['webpack', 'css', 'images', 'fonts', 'html']);

gulp.task('watch', ['server'], function () {
	gulp.watch('src/**/*.*', ['default']);
});








