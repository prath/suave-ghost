var spawn = require("child_process").spawn,
    fs    = require('fs'),
    when           = require('when');

/**
 * Grunt task Runner
 *
 * @param  {object} grunt
 * @return {mixed} builded files
 */
module.exports = function(grunt) {

    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jade');
    grunt.loadNpmTasks('grunt-contrib-requirejs');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-open');
    grunt.loadNpmTasks('grunt-dom-munger');
    grunt.loadNpmTasks('grunt-autoprefixer');
    grunt.loadNpmTasks('grunt-prettify');
    grunt.loadNpmTasks('grunt-devtools');

    grunt.initConfig({

        /**
         * clean all builded files
         *
         * @type {Object}
         */
        clean: {
            all: ['assets', '*.ico', '*.png'],
            css: ['assets/css'],
            js: ['assets/js'],
            img: ['assets/images', '*.ico', '*.png'],
            template: ['./*.hbs']
        },

        /**
         * livereload
         *
         * @type {Object}
         * @todo still not working
         */
        connect: {
            con: {
                options: {
                    port: 2368,
                    base: './'
                }
            }
        },

        /**
         * Open Dist index in new tab browser
         *
         * @type {Object}
         */
        open: {
            dev: {
                path: 'http://localhost:2368'
            }
        },
        /**
         * less tasks
         */
        less: {
            compile: {
                options: {
                    paths: ['src/less', 'src/less/inc', 'src/less/bootstrap-less', 'src/less/bootstrap-theme'],
                    dumpLineNumbers: true
                },
                files: [{
                    expand: true,
                    cwd: 'src/less/',
                    src: ['*.less'],
                    dest: 'assets/css',
                    ext: '.css',
                }]
            },
        },
        /**
         * minimize css files into *.min.css
         *
         * @type {css}
         */
        cssmin: {
            minify: {
                files: [{
                    expand: true,
                    cwd: './',
                    src: ['style.css'],
                    dest: 'assets/css',
                    ext: '.min.css',
                }]
            }
        },
        /**
         * autoprefix css
         * @type {Object}
         */
        autoprefixer: {
            dist: {
                options: {
                    browsers: ['last 4 version', '> 1%', 'ie 8', 'ie 7']
                },
                files: [{
                    expand: true,
                    cwd: 'assets/css',
                    src: ['*.css', '!bootstrap.css', '!bootstrap-responsive.css'],
                    dest: 'assets/css',
                    ext: '.css',
                }, {
                    expand: true,
                    cwd: './',
                    src: ['style.css'],
                    dest: './',
                    ext: '.css',
                }]
            }
        },
        /**
         * copy files tasks
         *
         * @type {Object}
         */
        copy: {
            js: {
                files: [{
                    expand: true,
                    flatten: true,
                    filter: 'isFile',
                    src: ['src/js/vendor/*'],
                    dest: 'assets/js/vendor/'
                }, {
                    expand: true,
                    flatten: true,
                    filter: 'isFile',
                    src: ['src/js/*'],
                    dest: 'assets/js/'
                }]
            },
            img: {
                files: [{
                    expand: true,
                    flatten: true,
                    filter: 'isFile',
                    src: ['src/images/*'],
                    dest: 'assets/images'
                }, {
                    expand: true,
                    flatten: true,
                    filter: 'isFile',
                    src: ['src/images/favicons/*'],
                    dest: './'
                }]
            },
            fontellocss: {
                files: [{
                    expand: true,
                    flatten: true,
                    filter: 'isFile',
                    src: ['src/fonticon/fontello/**/*', '!src/fonticon/fontello/demo.html'],
                    dest: 'assets/css'
                }]
            }
        },
        /**
         * Dom manipulation tasks
         *
         * @type {Object}
         */
        dom_munger: {
            target: {
                options: {
                    read: {
                        selector: 'script.concat',
                        attribute: 'src',
                        writeto: 'myJsRefs',
                        isPath: true,
                    }
                },
                src: 'dist/*.html'
            },
            targetCss: {
                options: {
                    read: {
                        selector: 'link.cm',
                        attribute: 'href',
                        writeto: 'myCssRefs',
                        isPath: true,
                    }
                },
                src: 'dist/*.html'
            },
            jsconcat: {
                options: {
                    callback: function($) {
                        $('script.concat:last').after('<script src="js/all/all.min.js"></script>');
                        $('script.concat').remove();
                    },
                },
                src: 'dist/*.html'
            },
            jscompress: {
                options: {
                    callback: function($) {
                        $('script.plugin').each(function(i) {
                            src = $(this).attr('src');
                            split = src.split('.js');
                            concat = split[0] + '.min.js';
                            $(this).attr('src', concat);
                        });
                    }
                },
                src: 'dist/*.html'
            },
            jsnone: {
                options: {
                    callback: function($) {}
                },
                src: 'dist/*.html'
            },
            cssconcat: {
                options: {
                    callback: function($) {
                        $('link.cm:last').after('<link rel="stylesheet" href="css/all/mixed.css">');
                        $('link.cm').remove();
                    }
                },
                src: 'dist/*.html'
            },
            csscompress: {
                options: {
                    callback: function($) {
                        $('link.cm').each(function(i) {
                            src = $(this).attr('href');
                            split = src.split('.css');
                            concat = split[0] + '.min.css';
                            $(this).attr('href', concat);
                        });
                    }
                },
                src: 'dist/*.html'
            },
        },
        /**
         * uglify js tasks
         * @type {Object}
         */
        uglify: {
            compress: {
                files: [{
                    expand: true,
                    src: '*.js',
                    dest: 'dist/js',
                    cwd: 'dist/js',
                    ext: '.min.js'
                }]
            },
            concat: {
                src: ['<%= dom_munger.data.myJsRefs %>'],
                dest: 'assets/js/all/all.min.js'
            }
        },
        /**
         * concat files task
         *
         * @type {Object}
         * @todo concat JS Files
         */
        concat: {
            files: {
                src: ['<%= dom_munger.data.myCssRefs %>'],
                dest: 'assets/css/mixed.css'
            }
        },
        /**
         * Jade tasks
         *
         * @type {Object}
         * @todo layout options variables (e.g. two columns, three columns, etc.)
         */
        jade: {
            compile: {
                options: {
                    data: {
                        debug: true,
                        title: 'Suave Ghost',
                        css_dir: 'css',
                        js_dir: 'js',
                        img_dir: 'images',
                    },
                    pretty: true
                },
                files: [{
                    expand: true,
                    cwd: 'src/templates',
                    src: ['*.jade'],
                    dest: './',
                    ext: '.hbs',
                }]
            }
        },

        /**
         * Prettify HTML Outputs
         * 
         * @type {Object}
         */
        prettify: {
            options: {
                indent_size: 4,
                brace_style: 'expand',
                unformatted: ['sub', 'sup', 'b', 'i', 'u']
            },
            all: {
                expand: true, 
                cwd: './', 
                ext: '.hbs',
                src: ['*.hbs'],
                dest: './'
            }
        },

        /**
         * watch and guard tasks
         *
         * @type {Object}
         * @todo other regarde tasks for js, image etc.
         */
        watch: {
            options: {
                livereload: true,
                nospawn: true
            },
            css: {
                files: [
                    'src/less/**/*.less'],
                tasks: [
                    'clean:css', 'less', 'copy:fontellocss', 'autoprefixer']
            },
            scripts: {
                files: [
                     'src/js/**/*.js'],
                tasks: ['clean:js', 'copy:js']
            },
            imgs: {
                files: [
                    'src/images/**/*'],
                tasks: ['clean:img', 'copy:img']
            }
        }
    });

    /**
     * ======================================================================================================================================
     */

    grunt.registerTask('default', ['clean:all', 
        'less','copy:fontellocss', 'autoprefixer',
        // 'jade',
        // 'prettify', 
        'copy:img',
        'copy:js',
        // 'connect', 
        // 'open', 
        'watch'
    ]);

    /**
     * ======================================================================================================================================
     */

    grunt.registerTask('buildcompress', 'build html with compressed css and js', function(t) {
        if (t) grunt.task.run(['clean:all',
            'less','copy:fontellocss',
            'jade', 
            'copy:img',
            'dom_munger:target', 'dom_munger:targetCss', 'cssmin', 
            'copy:js', 
            'uglify', 
            'dom_munger:jscompress', 'dom_munger:csscompress']);
        else grunt.task.run(['clean:all', 
            'less','copy:fontellocss',
            'jade', 
            'copy:img',
            'dom_munger:target', 'dom_munger:targetCss', 'cssmin', 
            'copy:js', 
            'uglify']);
    });
    grunt.registerTask('buildconcat', 'build html with compressed and concatted css and js', function(t) {
        if (t) grunt.task.run(['clean:all', 
            'less','copy:fontellocss',
            'jade', 
            'copy:img', 
            'dom_munger:target', 'dom_munger:targetCss', 'cssmin', 
            'copy:js',
            'uglify', 
            'dom_munger:jsconcat', 'dom_munger:cssconcat']);
        else grunt.task.run(['clean:all', 
            'less','copy:fontellocss',
            'jade', 
            'copy:img',
            'dom_munger:target', 'dom_munger:targetCss', 'cssmin', 
            'copy:js', 
            'uglify']);

    });

    /* Generate Changelog
     * - Pulls changelog from git, excluding merges.
     * - Uses first line of commit message. Includes committer name.
     */
    grunt.registerTask("changelog", "Generate changelog from Git", function () {
        // TODO: Break the contents of this task out into a separate module,
        // put on npm. (@cgiffard)

        var done = this.async();

        function git(args, callback, depth) {
            depth = depth || 0;

            if (!depth) {
                grunt.log.writeln('git ' + args.join(' '));
            }

            var buffer = [];
            spawn('git', args, {
                // We can reasonably assume the gruntfile will be in the root of the repo.
                cwd : __dirname,

                stdio : ['ignore', 'pipe', process.stderr]

            }).on('exit', function (code) {

                // Process exited correctly but we got no output.
                // Spawn again, but make sure we don't spiral out of control.
                // Hack to work around an apparent node bug.
                //
                // Frustratingly, it's impossible to distinguish this
                // bug from a genuine empty log.

                if (!buffer.length && code === 0 && depth < 20) {
                    return setImmediate(function () {
                        git(args, callback, depth ? depth + 1 : 1);
                    });
                }

                if (code === 0) {
                    return callback(buffer.join(''));
                }

                // We failed. Git returned a non-standard exit code.
                grunt.log.error('Git returned a non-zero exit code.');
                done(false);

            // Push returned data into the buffer
            }).stdout.on('data', buffer.push.bind(buffer));
        }

        // Crazy function for getting around inconsistencies in tagging
        function sortTags(a, b) {
            a = a.tag;
            b = b.tag;

            // NOTE: Accounting for different tagging method for
            // 0.2.1 and up.

            // If we didn't have this issue I'd just pass rcompare
            // into sort directly. Could be something to think about
            // in future.

            if (semver.rcompare(a, '0.2.0') < 0 ||
                    semver.rcompare(b, '0.2.0') < 0) {

                return semver.rcompare(a, b);
            }

            a = a.split('-');
            b = b.split('-');

            if (semver.rcompare(a[0], b[0]) !== 0) {
                return semver.rcompare(a[0], b[0]);
            }

            // Using this janky looking integerising-method
            // because it's faster and doesn't result in NaN, which
            // breaks sorting
            /*jslint bitwise: true */
            return (+b[1] | 0) - (+a[1] | 0);
        }

        // Gets tags in master branch, sorts them with semver,
        function getTags(callback) {
            git(['show-ref', '--tags'], function (results) {
                results = results
                    .split(/\n+/)
                    .filter(function (tag) {
                        return tag.length && tag.match(/\/\d+\.\d+/);
                    })
                    .map(function (tag) {
                        return {
                            'tag': tag.split(/tags\//).pop().trim(),
                            'ref': tag.split(/\s+/).shift().trim()
                        };
                    })
                    .sort(sortTags);

                callback(results);
            });
        }

        // Parses log to extract commit data.
        function parseLog(data) {
            var commits = [],
                commitRegex =
                    new RegExp(
                        '\\n*[|\\*\\s]*commit\\s+([a-f0-9]+)' +
                            '\\n[|\\*\\s]*Author:\\s+([^<\\n]+)<([^>\\n]+)>' +
                            '\\n[|\\*\\s]*Date:\\s+([^\\n]+)' +
                            '\\n+[|\\*\\s]*[ ]{4}([^\\n]+)',
                        'ig'
                    );

            // Using String.prototype.replace as a kind of poor-man's substitute
            // for a streaming parser.
            data.replace(
                commitRegex,
                function (wholeCommit, hash, author, email, date, message) {

                    // The author name and commit message may have trailing space.
                    author = author.trim();
                    message = message.trim();

                    // Reformat date to make it parse-able by JS
                    date =
                        date.replace(
                            /^(\w+)\s(\w+)\s(\d+)\s([\d\:]+)\s(\d+)\s([\+\-\d]+)$/,
                            '$1, $2 $3 $5 $4 $6'
                        );

                    commits.push({
                        'hash': hash,
                        'author': author,
                        'email': email,
                        'date': date,
                        'parsedDate': new Date(Date.parse(date)),
                        'message': message
                    });

                    return null;
                }
            );

            return commits;
        }

        // Gets git log for specified range.
        function getLog(to, from, callback) {
            var range = from && to ? from + '..' + to : '',
                args = [ 'log', 'master', '--no-color', '--no-merges', '--graph' ];

            if (range) {
                args.push(range);
            }

            git(args, function (data) {
                callback(parseLog(data));
            });
        }

        // Run the job
        getTags(function (tags) {
            var logPath = 'CHANGELOG.md',
                log = fs.createWriteStream(logPath),
                commitCache = {};

            function processTag(tag, callback) {
                var buffer = '',
                    peek = tag[1];

                tag = tag[0];

                getLog(tag.tag, peek.tag, function (commits) {

                    // Use the comparison with HEAD to remove commits which
                    // haven't been included in a build/release yet.

                    if (tag.tag === "HEAD") {
                        commits.forEach(function (commit) {
                            commitCache[commit.hash] = true;
                        });

                        return callback("");
                    }

                    buffer += '## Release ' + tag.tag + '\n';

                    commits = commits
                        .filter(function (commit) {

                            // Get rid of jenkins' release tagging commits
                            // Remove commits we've already spat out
                            return (
                                commit.author !== 'TryGhost-Jenkins' &&
                                !commitCache[commit.hash]
                            );
                        })
                        .map(function (commit) {
                            buffer += '\n* ' + commit.message + ' (_' + commit.author + '_)';
                            commitCache[commit.hash] = true;
                        });

                    if (!commits.length) {
                        buffer += "\nNo changes were made in this build.\n";
                    }

                    callback(buffer + '\n');
                });
            }

            // Get two weeks' worth of tags
            tags.unshift({'tag': 'HEAD'});

            tags =
                tags
                    .slice(0, 14)
                    .map(function (tag, index) {
                    return [
                        tag,
                        tags[index + 1] || tags[index]
                    ];
                });

            log.write('# Ghost Changelog\n\n');
            log.write('_Showing ' + tags.length + ' releases._\n');

            when.reduce(tags,
                function (prev, tag, idx) {
                    return when.promise(function (resolve) {
                        processTag(tag, function (releaseData) {
                            resolve(prev + '\n' + releaseData);
                        });
                    });
                }, '')
                .then(function (reducedChangelog) {
                    log.write(reducedChangelog);
                    log.close();
                    done(true);
                });
        });
    });

};