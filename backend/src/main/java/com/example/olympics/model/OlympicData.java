package com.example.olympics.model;

import jakarta.persistence.*;

@Entity
@Table(name = "olympic_data")
public class OlympicData {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "athlete")
    private String athlete;
    
    @Column(name = "age")
    private Integer age;
    
    @Column(name = "country")
    private String country;
    
    @Column(name = "year")
    private Integer year;
    
    @Column(name = "date")
    private String date;
    
    @Column(name = "sport")
    private String sport;
    
    @Column(name = "gold")
    private Integer gold;
    
    @Column(name = "silver")
    private Integer silver;
    
    @Column(name = "bronze")
    private Integer bronze;
    
    @Column(name = "total")
    private Integer total;

    public OlympicData() {}

    public OlympicData(Long id, String athlete, Integer age, String country, Integer year,
                       String date, String sport, Integer gold, Integer silver, Integer bronze, Integer total) {
        this.id = id;
        this.athlete = athlete;
        this.age = age;
        this.country = country;
        this.year = year;
        this.date = date;
        this.sport = sport;
        this.gold = gold;
        this.silver = silver;
        this.bronze = bronze;
        this.total = total;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getAthlete() { return athlete; }
    public void setAthlete(String athlete) { this.athlete = athlete; }

    public Integer getAge() { return age; }
    public void setAge(Integer age) { this.age = age; }

    public String getCountry() { return country; }
    public void setCountry(String country) { this.country = country; }

    public Integer getYear() { return year; }
    public void setYear(Integer year) { this.year = year; }

    public String getDate() { return date; }
    public void setDate(String date) { this.date = date; }

    public String getSport() { return sport; }
    public void setSport(String sport) { this.sport = sport; }

    public Integer getGold() { return gold; }
    public void setGold(Integer gold) { this.gold = gold; }

    public Integer getSilver() { return silver; }
    public void setSilver(Integer silver) { this.silver = silver; }

    public Integer getBronze() { return bronze; }
    public void setBronze(Integer bronze) { this.bronze = bronze; }

    public Integer getTotal() { return total; }
    public void setTotal(Integer total) { this.total = total; }

    @Override
    public String toString() {
        return "OlympicData{" +
                "id=" + id +
                ", athlete='" + athlete + '\'' +
                ", country='" + country + '\'' +
                ", year=" + year +
                ", sport='" + sport + '\'' +
                ", total=" + total +
                '}';
    }
}
