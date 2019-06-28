# encoding: utf-8

#UU5 Server

require "sinatra/base" #web server framework
require 'json'
require 'time'
require 'securerandom'
require 'open-uri'

# before server start must be run npm run dist
require 'fileutils'
FileUtils.copy_entry(File.dirname(__FILE__) + '/../uu5', File.dirname(__FILE__) + '/public')
FileUtils.copy_entry(File.dirname(__FILE__) + '/../dist', File.dirname(__FILE__) + '/public')

# Main server Sinatra::Base class
module UU5
  class Server < Sinatra::Base
    #enable static sources serving from the directory ./static
    set :static, true
    set :public_folder, File.dirname(__FILE__) + '/public'

    #enable Error Handling in Development mode
    set :show_exceptions, false
    set :raise_errors, false

    #enable remote calls - Comment for runtime!!!
    set :remote, true
    set :bind, '0.0.0.0'
    set :port, 2222 #http://localhost

    def buildError
      uu_dto_out ||= {:schema => 'UU/OS/DTO', :uri => Time.now.iso8601, :data => {}}
      uu_dto_out[:data][:message]=env['sinatra.error'].message
      uu_dto_out[:data][:backtrace]=env['sinatra.error'].backtrace
      return uu_dto_out.to_json
    end

    #routes
    error do
      #500 error handler
      buildError
    end

    not_found do
      #404 error handler
      buildError
    end

    get '/' do
      "UU5 Demo Server ( #{Time.now.iso8601})"
    end

    get '/env' do
      env.to_json
    end

    get '/request' do
      request.env.to_json
    end

    # get '/favicon.ico' do
    #   OpenURI::Buffer.send :remove_const, 'StringMax' if OpenURI::Buffer.const_defined?('StringMax')
    #   OpenURI::Buffer.const_set 'StringMax', 0
    #
    #   send_file open('https://www.unicorn.com/favicon.ico'),
    #             type: 'image/vnd.microsoft.icon',
    #             disposition: 'inline'
    # end

    post '/logError' do
      inp = request.body.read
      inp.force_encoding('UTF-8')
      puts JSON.pretty_generate(JSON.parse(inp))
    end

    ######################## ROUTER START ##########################
    get '/core/common/demo/router' do
      if request.content_type == 'application/json'
        {
          data: {
            status: 'ok',
            profiles: ['executives', 'readers']
          }
        }.to_json
      else
        get_index
      end
    end

    get '/core/common/demo/home' do
      if request.content_type == 'application/json'
        {
          data: {
            status: 'ok',
            profiles: ['executives', 'readers']
          }
        }.to_json
      else
        get_index
      end
    end

    get '/core/common/demo/about' do
      sleep 4
      if request.content_type == 'application/json'
        {
          data: {
            status: 'ok',
            profiles: ['readers']
          }
        }.to_json
      else
        get_index
      end
    end

    get '/core/common/demo/history' do
      if request.content_type == 'application/json'
        {
          data: {
            status: 'ok',
            profiles: ['executives']
          }
        }.to_json
      else
        get_index
      end
    end

    get '/core/common/demo/form' do
      if request.content_type == 'application/json'
        {
          data: {
            status: 'ok',
            profiles: ['executives', 'readers']
          }
        }.to_json
      else
        get_index
      end
    end

    get '/core/common/demo/404' do
      if request.content_type == 'application/json'
        {
          data: {
            status: 'ok',
            profiles: ['executives', 'readers']
          }
        }.to_json
      else
        get_index
      end
    end

    get '/core/common/demo/assets/*' do
      send_file(File.dirname(__FILE__) + request.env['PATH_INFO'].gsub(/^\/core\/common\/demo/, '/public'), :disposition => 'inline')
    end

    private

    def get_index
      File.read(File.dirname(__FILE__) + '/public/core/common/demo/router2.html')
    end
    ######################## ROUTER END ##########################
  end
end

#run on http://localhost
UU5::Server.run!
