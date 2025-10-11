require "net/http"
require "uri"

class RsiCitizenChecker
  BASE_URL = "https://robertsspaceindustries.com/en/citizens/".freeze

  def self.verify(handle)
    return { valid: false, status: 422, message: "Invalid handle" } if handle.blank?

    encoded = URI.encode_www_form_component(handle.strip)
    url = URI.parse("#{BASE_URL}#{encoded}")

    begin
      response = Net::HTTP.start(url.host, url.port, use_ssl: true) do |http|
        req = Net::HTTP::Get.new(url)
        req["User-Agent"] = "Star-SynkBot/1.0 (+https://star-synk.com)"
        http.request(req)
      end
    rescue StandardError => e
      Rails.logger.error("RSI check failed for #{handle}: #{e.message}")
      return { valid: false, status: 500, message: "Network error" }
    end

    body = response.body.to_s
    if response.code.to_i == 200
      if body.match?(/Page not found|Citizen not found/i)
        { valid: false, status: 404, message: "#{handle} citizen dossier not found" }
      else
        { valid: true, status: 200, message: "#{handle} citizen dossier found" }
      end
    else
      { valid: false, status: response.code.to_i, message: "Unexpected HTTP #{response.code}" }
    end
  end
end
