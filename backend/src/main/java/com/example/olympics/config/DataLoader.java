package com.example.olympics.config;

import com.example.olympics.model.OlympicData;
import com.example.olympics.repository.OlympicDataRepository;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URI;
import java.net.URL;
import java.util.List;
import java.util.Map;

@Component
public class DataLoader implements CommandLineRunner {
    
    @Autowired
    private OlympicDataRepository repository;
    
    @Override
    public void run(String... args) throws Exception {
        if (repository.count() == 0) {
            System.out.println("Loading Olympic data from external source...");
            
            // Fetch data from the same source used in the React app
            URL url = URI.create("https://www.ag-grid.com/example-assets/olympic-winners.json").toURL();
            HttpURLConnection conn = (HttpURLConnection) url.openConnection();
            conn.setRequestMethod("GET");
            
            BufferedReader reader = new BufferedReader(new InputStreamReader(conn.getInputStream()));
            StringBuilder response = new StringBuilder();
            String line;
            while ((line = reader.readLine()) != null) {
                response.append(line);
            }
            reader.close();
            
            ObjectMapper mapper = new ObjectMapper();
            List<Map<String, Object>> data = mapper.readValue(response.toString(), new TypeReference<List<Map<String, Object>>>() {});
            
            // Convert and save data
            for (Map<String, Object> item : data) {
                OlympicData olympicData = new OlympicData();
                olympicData.setAthlete((String) item.get("athlete"));
                olympicData.setAge(item.get("age") != null ? ((Number) item.get("age")).intValue() : null);
                olympicData.setCountry((String) item.get("country"));
                olympicData.setYear(item.get("year") != null ? ((Number) item.get("year")).intValue() : null);
                olympicData.setDate((String) item.get("date"));
                olympicData.setSport((String) item.get("sport"));
                olympicData.setGold(item.get("gold") != null ? ((Number) item.get("gold")).intValue() : 0);
                olympicData.setSilver(item.get("silver") != null ? ((Number) item.get("silver")).intValue() : 0);
                olympicData.setBronze(item.get("bronze") != null ? ((Number) item.get("bronze")).intValue() : 0);
                olympicData.setTotal(item.get("total") != null ? ((Number) item.get("total")).intValue() : 0);
                
                repository.save(olympicData);
            }
            
            System.out.println("Loaded " + repository.count() + " Olympic records into database.");
        }
    }
}
