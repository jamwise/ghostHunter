module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        copy: {
            ghosthunter: {
                src: "src/<%= pkg.name %>.js",
                dest: "dist/ghostHunter.js",
                options: {
                    process: function(content, path) {
                        var lunr = grunt.file.read('./modules/lunr/lunr.js');
                        content = content.replace(/\/\*\s+lunr\s+\*\//i, 'var lunr = ' + lunr);
                        return grunt.template.process(content)
                    }
                }
            },
            ghosthunter_nodependencies: {
                src: "src/<%= pkg.name %>.js",
                dest: "dist/ghostHunter-nodependencies.js",
                options: {
                    process: function(content, path) {
                        content = content.replace(/\/\*\s+lunr\s+\*\//i, 'var lunr = require("lunr")');
                        return grunt.template.process(content)
                    }
                }
            },
            lunr: {
                src: "modules/lunr/lunr.js",
                dest: "dist/lunr.js",
                options: {
                    process: function(content, path) {
                        return grunt.template.process(content)
                    }
                }
            }
        },
        uglify: {
            ghosthunter: {
                options: {
                    banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
                },
                src: 'dist/ghostHunter.js',
                dest: 'dist/jquery.ghostHunter.min.js'
            },
            ghosthunter_nodependencies: {
                options: {
                    banner: '/*! <%= pkg.name %>-nodependencies <%= grunt.template.today("yyyy-mm-dd") %> */\n'
                },
                src: 'dist/ghostHunter-nodependencies.js',
                dest: 'dist/jquery.ghostHunter-nodependencies.min.js'
            },
            lunr: {
                options: {
                    banner: '/*! <%= pkg.name %>-nodependencies <%= grunt.template.today("yyyy-mm-dd") %> */\n'
                },
                src: 'dist/lunr.js',
                dest: 'dist/lunr.min.js'
            }
        }
    });
    
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-copy');
    
    // Default task(s).
    grunt.registerTask('default', ['copy', 'uglify']);
};
