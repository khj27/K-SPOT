"use client";

import { useMemo, useState } from "react";

import { AppIcon } from "@/components/common/app-icon";
import { ContentCard } from "@/components/explore/content-card";
import { contentTypeOptions, demoContents, regionOptions } from "@/mocks/content-data";
import type { ContentSort, ContentTypeId, ExploreInitialFilters } from "@/types/content";

const currentYear = 2026;
const minimumYear = 1990;

export function ContentExplorer({ initialFilters }: { initialFilters: ExploreInitialFilters }) {
  const [query, setQuery] = useState(initialFilters.query);
  const [selectedTypes, setSelectedTypes] = useState<ContentTypeId[]>(initialFilters.type === "all" ? ["all"] : [initialFilters.type]);
  const [region, setRegion] = useState<(typeof regionOptions)[number]>("전체 지역");
  const [yearFrom, setYearFrom] = useState(minimumYear);
  const [yearTo, setYearTo] = useState(currentYear);
  const [sort, setSort] = useState<ContentSort>("latest");
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const filteredContents = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase("ko");
    const selectedWithoutAll = selectedTypes.filter((type) => type !== "all");

    return demoContents
      .filter((content) => selectedWithoutAll.length === 0 || selectedWithoutAll.includes(content.contentType))
      .filter((content) => region === "전체 지역" || content.regions.includes(region))
      .filter((content) => content.year >= yearFrom && content.year <= yearTo)
      .filter((content) => {
        if (!normalizedQuery) return true;
        return [content.title, content.typeLabel, ...content.artistNames, ...content.regions].some((value) => value.toLocaleLowerCase("ko").includes(normalizedQuery));
      })
      .sort((a, b) => {
        if (sort === "oldest") return a.year - b.year;
        if (sort === "places") return b.placeCount - a.placeCount;
        if (sort === "title") return a.title.localeCompare(b.title, "ko");
        return b.year - a.year;
      });
  }, [query, region, selectedTypes, sort, yearFrom, yearTo]);

  function selectCategory(type: ContentTypeId) {
    setSelectedTypes(type === "all" ? ["all"] : [type]);
  }

  function toggleFilterType(type: ContentTypeId) {
    if (type === "all") {
      setSelectedTypes(["all"]);
      return;
    }

    setSelectedTypes((current) => {
      const withoutAll = current.filter((item) => item !== "all");
      const next = withoutAll.includes(type) ? withoutAll.filter((item) => item !== type) : [...withoutAll, type];
      return next.length ? next : ["all"];
    });
  }

  function resetFilters() {
    setQuery("");
    setSelectedTypes(["all"]);
    setRegion("전체 지역");
    setYearFrom(minimumYear);
    setYearTo(currentYear);
    setSort("latest");
  }

  return (
    <main className="explore-page">
      <section className="explore-title-row">
        <div><h1>콘텐츠 탐색</h1><p>좋아하는 K-콘텐츠에서 로컬 여행의 시작점을 찾아보세요.</p></div>
        <label className="explore-inline-search"><AppIcon name="search" size={18} /><span className="sr-only">콘텐츠 검색</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="콘텐츠 제목, 배우, 아티스트 검색" type="search" /></label>
      </section>

      <nav className="explore-category-tabs" aria-label="콘텐츠 유형">
        {contentTypeOptions.map((option) => <button className={(selectedTypes.includes("all") && option.id === "all") || selectedTypes.includes(option.id) ? "is-active" : undefined} type="button" onClick={() => selectCategory(option.id)} key={option.id}>{option.label}</button>)}
      </nav>

      <button className="mobile-filter-toggle" type="button" onClick={() => setMobileFilterOpen((open) => !open)} aria-expanded={mobileFilterOpen} aria-controls="explore-filter-panel"><AppIcon name="sparkles" size={17} /> 필터 {mobileFilterOpen ? "닫기" : "열기"}<span>{filteredContents.length}개 결과</span></button>

      <div className="explore-workspace">
        <section className="explore-results" aria-live="polite">
          <div className="results-toolbar"><p>전체 <strong>{filteredContents.length}</strong>개의 콘텐츠 <span>· UI 검증용 데모</span></p><label>정렬<span className="sr-only">콘텐츠 정렬</span><select value={sort} onChange={(event) => setSort(event.target.value as ContentSort)}><option value="latest">최신순</option><option value="oldest">오래된순</option><option value="places">촬영지 많은순</option><option value="title">제목순</option></select></label></div>

          {filteredContents.length > 0 ? (
            <div className="explore-card-grid">
              {filteredContents.map((content) => <ContentCard content={content} saved={savedIds.includes(content.id)} onToggleSaved={(id) => setSavedIds((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id])} key={content.id} />)}
            </div>
          ) : (
            <div className="explore-empty"><AppIcon name="search" size={34} /><h2>조건에 맞는 콘텐츠가 없어요.</h2><p>검색어나 필터 범위를 바꿔 다시 찾아보세요.</p><button type="button" onClick={resetFilters}>필터 초기화</button></div>
          )}
        </section>

        <aside className={`explore-filter-panel${mobileFilterOpen ? " is-mobile-open" : ""}`} id="explore-filter-panel">
          <div className="filter-panel-heading"><h2>필터</h2><button type="button" onClick={resetFilters}>초기화</button></div>
          <fieldset><legend>콘텐츠 유형</legend>{contentTypeOptions.map((option) => <label key={option.id}><input type="checkbox" checked={(option.id === "all" && selectedTypes.includes("all")) || selectedTypes.includes(option.id)} onChange={() => toggleFilterType(option.id)} /><span>{option.label}</span></label>)}</fieldset>
          <label className="filter-select-label">지역<select value={region} onChange={(event) => setRegion(event.target.value as (typeof regionOptions)[number])}>{regionOptions.map((option) => <option key={option}>{option}</option>)}</select></label>
          <fieldset className="year-filter"><legend>공개 연도</legend><div><label><span>시작</span><input min={minimumYear} max={yearTo} value={yearFrom} onChange={(event) => setYearFrom(Number(event.target.value))} type="number" /></label><b>—</b><label><span>종료</span><input min={yearFrom} max={currentYear} value={yearTo} onChange={(event) => setYearTo(Number(event.target.value))} type="number" /></label></div><input aria-label="공개 연도 시작 슬라이더" min={minimumYear} max={currentYear} value={yearFrom} onChange={(event) => setYearFrom(Math.min(Number(event.target.value), yearTo))} type="range" /></fieldset>
          <label className="filter-select-label">정렬<select value={sort} onChange={(event) => setSort(event.target.value as ContentSort)}><option value="latest">최신순</option><option value="oldest">오래된순</option><option value="places">촬영지 많은순</option><option value="title">제목순</option></select></label>
          <button className="filter-apply-button" type="button" onClick={() => setMobileFilterOpen(false)}>필터 적용 · {filteredContents.length}개</button>
          <p className="filter-demo-note">실제 공개 전 출처와 콘텐츠-장소 관계 검수가 필요합니다.</p>
        </aside>
      </div>
    </main>
  );
}
