package com.example.olympics.model;

import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "OLYMPIC_DATA")
public class OlympicData {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    @Column(name = "athlete") private String athlete;
    @Column(name = "age") private Integer age;
    @Column(name = "country") private String country;
    @Column(name = "year") private Integer year;
    @Column(name = "date") private String date;
    @Column(name = "sport") private String sport;
    @Column(name = "gold") private Integer gold;
    @Column(name = "silver") private Integer silver;
    @Column(name = "bronze") private Integer bronze;
    @Column(name = "total") private Integer total;
    
}