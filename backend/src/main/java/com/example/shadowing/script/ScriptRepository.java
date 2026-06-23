package com.example.shadowing.script;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ScriptRepository extends JpaRepository<Script, Long> {

    List<Script> findByVideoIdOrderByStartTimeAsc(Long videoId);
}
