package com.backend.olympics.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.backend.olympics.model.OlympicData;

import java.util.List;

@Repository
public interface OlympicDataRepository extends JpaRepository<OlympicData, Long>, JpaSpecificationExecutor<OlympicData> {
    
    @Query("SELECT DISTINCT o.country FROM OlympicData o ORDER BY o.country ASC")
    List<String> findDistinctCountries();
}
