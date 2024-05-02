# 根據 filelist.txt 的內容下載檔案
# filelist.txt 格式如下：
# main.ndx,123456,https://www.server.org/path/main.ndx
# 處理方式為：
# 先檢查此目錄是否有 main.ndex，檔案 size 是不是 123456?
# 如果沒有這個檔案或檔案size不對，就由 https://www.server.org/path/main.ndx 下載

# 下載 google 雲端檔案格式 https://drive.google.com/uc?id={id}&export=download

require 'open-uri'

# 讀取 filelist.txt 檔案
lines = File.readlines('filelist.txt')

# 遍歷每一行
lines.each { |line|
    # 解析每一行的資訊
    file_info = line.chomp.split(',')
    file_name = file_info[0]
    file_size = file_info[1].to_i
    file_url = file_info[2]

    # 檢查本地是否有相應檔案
    if File.exist?(file_name) && File.size(file_name) == file_size
        puts "#{file_name} 已存在且大小正確，無需下載。"
    else
        # 下載檔案
        puts "下載 #{file_name} ..."

        # 先處理大檔的警告
        if file_size > 5000000
            puts "檔案較大，請耐心稍候..."
            # html = URI.open(file_url).read

            # <form id="download-form" action="https://drive.google.com/uc?id=10fhAIiIRTHuj08Z89GtJPCiWuqLeaP-3&amp;export=download&amp;format=application/octet-stream&amp;confirm=t&amp;uuid=eb2c2b64-b67e-4bd2-92e1-54fea44248f7&amp;at=AB6BwCC9ZjULf1so4hK9d_ET2rcd:1703312632877" method="post"><input type="submit" id="uc-download-link" class="goog-inline-block jfk-button jfk-button-action" value="仍要下載"></form>

            # if html.match(/action="(.*?)"/)
            #     html = $1
            #     html.gsub!('&amp;','&')
            #     file_url = html
            #     puts "檔案較大，請耐心稍候..."
            # else
            #     puts "格式不太對勁，請檢查結果是否正確。"
            # end
        end

        # 下載檔案
        File.open(file_name, 'wb') { |file|
           file << URI.open(file_url).read
        }
        puts "#{file_name} 下載完成。"
    end
}
