export type Locale = "ko" | "en";

// Stored content, filter values and account data remain in their original language.
// This catalogue translates presentation only, without sending user data to a service.
const entries = `
저장 자료를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.|Unable to load your saved data. Please try again shortly.
저장 자료를 확인하고 있습니다.|Checking your saved data.
찜과 최근 본 장소는 자동 저장됩니다. 일정은 편집 후 일정 저장을 눌러 주세요. 같은 계정으로 다른 기기에서도 확인할 수 있습니다.|Saved places and recent views update automatically. After editing a trip, select Save itinerary. Access your data on other devices with the same account.
일정을 편집한 뒤 일정 저장을 누르면 계정에 반영됩니다. 같은 계정으로 다른 기기에서도 확인할 수 있습니다.|Select Save itinerary after editing to save your changes to your account. Access your trips on other devices with the same account.
선택한 지역과 콘텐츠 취향을 반영한 추천|Recommendations based on your region and content preferences
좌표가 있는 일정 장소를 순서대로 표시합니다. 직접 입력 장소는 아래 일정에서 확인하세요.|Trip places with known locations are shown in order. Find custom places in the itinerary below.
지도에 표시할 위치 정보가 없습니다. 직접 입력한 장소는 일정에 저장됩니다.|No map locations are available. Custom places are still saved in your itinerary.
페이지를 불러오지 못했습니다.|Unable to load this page.
잠시 후 다시 시도해 주세요. 저장된 자료는 삭제되지 않습니다.|Please try again shortly. Your saved data has not been deleted.
다시 시도|Try again
숙소|Stays
식사|Dining
놀거리|Things to do
주변 장소 분류|Nearby place categories
조회된 주변 장소를 분류별로 볼 수 있습니다. 놀거리는 관광지·문화시설·행사·레포츠를 포함합니다.|Filter the nearby results by category. Things to do includes sights, cultural venues, events and activities.
조회된 장소 중 선택한 분류에 해당하는 곳이 없습니다. 다른 분류를 선택해 주세요.|No places in these results match this category. Try another category.
직접 입력한 장소|Custom places
장소 이름|Place name
새 장소 이름|New place name
주소 또는 메모|Address or note
직접 입력 장소 추가|Add custom place
직접 입력한 장소는 일정에 저장되며 지도에는 표시되지 않습니다.|Custom places are saved in your trip but are not shown on the map.
직접 입력 장소의 이름·날짜·시간을 확인해 주세요.|Check the name, day and times of your custom places.
앞으로 이동|Move earlier
뒤로 이동|Move later
여행 일정 관리|Manage trips
여행 제목|Trip title
여행 인원|Travelers
명| travelers
일|days
나의 여행 일정|My itinerary
시작 시간|Start time
종료 시간|End time
이 일정의 장소 지도|Map of this itinerary
현재 일정에 포함된 장소만 순서대로 표시합니다.|Only the places in this itinerary are shown, in order.
일정에 장소를 추가해 주세요.|Add a place to your itinerary.
여행 인원은 1~100명으로 입력해 주세요.|Enter between 1 and 100 travelers.
시작·종료 시간을 모두 입력하고 종료 시간을 더 늦게 설정해 주세요.|Enter both times, with the end later than the start.
여행 일정이 저장되었습니다.|Your itinerary has been saved.
여행 일정 저장에 실패했습니다. 다시 시도해주세요.|Unable to save the itinerary. Please try again.
정말 이 여행 일정을 삭제하시겠습니까?|Delete this itinerary?
삭제한 일정은 되돌릴 수 없습니다.|This action cannot be undone.
취소|Cancel
저장한 여행 일정이 없습니다.|No saved itineraries yet.
저장한 일정의 제목·인원·시간과 장소를 관리하세요.|Manage the title, travelers, times and places in your saved trips.
주변 관광지 찾아 담기|Find nearby attractions
찜하기|Save place
찜됨|Saved
찜한 장소에 추가되었습니다.|Added to your saved places.
찜한 장소에서 삭제되었습니다.|Removed from your saved places.
콘텐츠 제보|Suggest a place
내 취향의 촬영지에서 나만의 여행까지|From favorite scenes to your own adventure
지도에서 장소를 찾고, 추천 코스를 편집해 저장하세요. 마음에 든 장소는 마이페이지에 모아둘 수 있어요.|Explore the map, customize an itinerary and save your trip. Keep favorite places on My page.
장소 유형|Place category
관광지|Attractions
음식점|Restaurants
문화시설|Culture
숙박|Accommodation
축제·행사|Festivals & events
쇼핑|Shopping
기타|Other
레포츠|Outdoor activities
여행코스|Tour routes
이전|Previous
다음|Next
콘텐츠 제보가 접수되었습니다.|Your suggestion has been received.
관리자가 내용을 확인한 뒤 등록 여부를 검토합니다.|An administrator will review your suggestion before publication.
다른 장소 제보하기|Suggest another place
장소명 / 콘텐츠명|Place / content name
장소명 / 콘텐츠명 (필수)|Place / content name (required)
장소명이나 콘텐츠명만 적어도 제보할 수 있어요. 나머지는 아는 내용만 자유롭게 알려주세요.|Just a place or content name is enough. Share any other details you know.
예: 아이브 안유진 콘텐츠|e.g. Content featuring IVE's An Yujin
어떤 콘텐츠나 장소인지, 추가되었으면 하는 내용을 편하게 적어주세요.|Tell us about the content or place, or what you would like us to add.
간단한 설명 (선택)|Brief description (optional)
추가 정보 남기기 (모두 선택)|Add more details (all optional)
카테고리 (선택)|Category (optional)
지역 (선택)|Region (optional)
주소 (선택)|Address (optional)
관련 URL (선택)|Related URL (optional)
추가 요청 사유 (선택)|Reason for your suggestion (optional)
기타 의견 (선택)|Other comments (optional)
선택하지 않음|Not selected
장소명 / 콘텐츠명과 입력한 항목의 글자 수·URL을 확인해 주세요.|Check the place / content name, field lengths and any URL you entered.
카테고리|Category
간단한 설명|Brief description
관련 URL|Related URL (optional)
추가 요청 사유|Reason for your suggestion
기타 의견|Other comments (optional)
제보 보내기|Submit suggestion
아직 소개되지 않은 장소나 콘텐츠를 알려주세요.|Tell us about a place or content we haven't featured yet.
로그인 후 이용해 주세요.|Please log in to continue.
필수 항목과 관련 URL을 확인해 주세요.|Check the required fields and related URL.
제보를 저장하지 못했습니다. 다시 시도해 주세요.|Unable to submit. Please try again.
상세정보를 잠시 불러올 수 없습니다.|Details are temporarily unavailable.
데모|Demo
데모 데이터 · 공개 전 검수 필요|Demo data · Verification required
현재 장소 정보는 화면 기능 검증을 위한 데모 데이터입니다. 공개 전 공식 관광 정보와 촬영 출처를 확인합니다.|This is demo data pending verification.
지도를 불러오지 못했습니다. 아래 카카오맵에서 위치를 확인해 주세요.|Unable to load the map. Open Kakao Map below to see the location.
홈|Home
K-SPOT 홈|K-SPOT home
콘텐츠 검색|Explore content
지도 탐색|Explore map
맞춤 추천|Discover
여행 코스 추천|Trip planner
찜한 장소|Saved places
마이 페이지|My page
관리자|Admin
로그인·가입|Log in / Sign up
지역, 콘텐츠, 장소 검색|Search regions, content and places
지역, 콘텐츠, 장소를 검색해보세요|Search regions, content or places
콘텐츠명, 장소명, 지역을 검색해보세요|Search content, places or regions
K-콘텐츠로 떠나는 나만의 여행|Your journey through K-content
나만의 K-콘텐츠 여행|Your K-content journey
장면 속으로|Step into the scene
등록된 촬영지 둘러보기|Explore filming locations
콘텐츠 보기|Explore content
주요 메뉴|Main navigation
추천 콘텐츠|Featured content
본문 바로가기|Skip to content
등록 콘텐츠 지도|Map of filming locations
K-콘텐츠 촬영지 지도|K-content filming locations
콘텐츠 유형별 지도 색상|Map colors by content type
드라마|Drama
예능|Variety show
영화|Film
뮤직비디오|Music video
아이돌|K-pop
웹툰/웹소설|Webtoon / Web novel
전체|All
전체 지역|All regions
전국|Nationwide
서울|Seoul
부산|Busan
대구|Daegu
인천|Incheon
광주|Gwangju
대전|Daejeon
울산|Ulsan
세종|Sejong
경기|Gyeonggi
강원|Gangwon
충북|Chungbuk
충남|Chungnam
전북|Jeonbuk
전남|Jeonnam
경북|Gyeongbuk
경남|Gyeongnam
제주|Jeju
전남광주|Jeonnam / Gwangju
등록된 콘텐츠|Featured locations: 
곳| places
개| items
개 선택| selected
공개된 콘텐츠를 준비하고 있습니다.|New locations are coming soon.
어떤 콘텐츠를 좋아하시나요?|What do you love watching?
좋아하는 유형에서 전국의 K-콘텐츠 장소를 찾아보세요.|Find K-content locations across Korea by category.
전체 보기|View all
나만의 여행 코스를 추천받아보세요!|Plan your own K-content trip!
관심 콘텐츠와 취향을 선택하면 맞춤 여행 코스를 추천해드려요.|Choose your interests to build a personalized itinerary.
코스 추천 시작하기|Plan a trip
관리자 검수를 통과한 콘텐츠 장소와 한국관광공사 관광정보를 함께 제공합니다.|Explore verified filming locations and Korea Tourism Organization travel information.
좋아하는 콘텐츠의|Discover the locations
촬영지를 찾아보세요.|from your favorite stories.
드라마, 예능, 영화 속 장면을 따라 전국의 로컬 장소를 발견해 보세요.|Follow scenes from dramas, shows and films to discover places across Korea.
검색 결과|Results
콘텐츠 또는 장소 검색|Search content or places
콘텐츠 유형|Content type
지역|Region
검색|Search
지도에서 보기|View on map
장소 상세 보기|View place
검색 결과가 없습니다.|No results found.
검색어 또는 필터를 바꿔 다시 찾아보세요.|Try another search term or filter.
전체 결과 보기|View all results
관리자가 공개한 데이터는 작품·장소 관계의 출처와 검수일을 함께 관리합니다.|Published locations include source references and review dates.
지도에서 촬영지를|Explore filming locations
한눈에 찾아보세요.|on the map.
콘텐츠와 지역을 선택하면 관련 장소를 지도와 목록으로 확인할 수 있습니다.|Choose a category and region to explore places on the map and in the list.
검색된 촬영지|Filming locations
필터 적용|Apply filters
조건에 맞는 촬영지가 없습니다.|No filming locations match your filters.
필터를 바꿔 다시 검색해 보세요.|Try different filters.
전체 지도 보기|View all locations
지도 좌표는 실제 위·경도를 사용하며, 관리자 공개 데이터는 출처와 검수일을 함께 관리합니다.|Locations use geographic coordinates and include source references and review dates.
촬영지|Filming locations: 
상세 보기|View details
Kakao 지도|Kakao Map
Kakao 지도 키를 설정하면 실제 지도가 표시됩니다.|The map is not configured yet.
지도를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.|Unable to load the map. Please try again later.
지도를 불러오는 중…|Loading map…
탐색 결과로 돌아가기|Back to explore
· K-콘텐츠 촬영 장소|· K-content filming location
작품 속 장면을 떠올리며 주변의 로컬 매력도 함께 경험해 보세요.|Relive the scene and discover the local neighborhood.
장소 저장|Save place
저장됨|Saved
공유|Share
유튜브 바로가기|Watch on YouTube
유튜브 바로가기 (새 탭)|Watch on YouTube (opens a new tab)
Firebase에 장소를 저장했습니다.|Place saved to your account.
Firebase에서 찜을 해제했습니다.|Place removed from saved places.
장소 주소를 복사했습니다.|Place link copied.
공유하지 못했습니다. 브라우저 주소창의 주소를 복사해 주세요.|Unable to share. Please copy the address from your browser.
K-SPOT 장소|K-SPOT place
이 장소가 등장한 콘텐츠|Featured in this content
정보 출처와 검수 상태|Sources and verification
근거 자료 확인|View source
장소 정보|Place information
장소명|Place name
주소|Address
방문 팁|Before you visit
운영 시간과 접근성을 방문 전 확인해 주세요.|Check opening hours and accessibility before visiting.
촬영지 위치|Location
카카오맵에서 길찾기|Directions on Kakao Map
이 장소를 포함한 코스 추천|Plan a trip with this place
주변에서 함께 즐길 곳|Things to do nearby
실시간 연동|Live data
연동 준비|Connecting
한국관광공사 주변 관광정보를 불러오는 중입니다…|Loading nearby places from Korea Tourism Organization…
주소 정보 확인 중|Address unavailable
주소 정보 없음|Address unavailable
주변 관광지|Nearby attractions
주변 즐길거리를 찾지 못했습니다.|No nearby attractions found.
주변 관광정보를 불러오지 못했습니다.|Unable to load nearby attractions.
한국관광공사 국문 관광정보 서비스 · locationBasedList2 · 반경 5km|Korea Tourism Organization · Korean tourism data · within 5 km
취향으로 찾는|Discover your
다음 여행지|next destination
지역과 콘텐츠 취향을 고르면 추천 이유와 함께 장소를 보여드립니다.|Choose a region and content type to see personalized suggestions.
추천 보기|Show recommendations
등록 콘텐츠|Filming locations
주변 즐길거리|Nearby activities
추천 항목|Recommendation categories
콘텐츠 여행에 더할 즐길거리|More to enjoy on your trip
선택한 촬영지 주변 5km의 관광지·음식점·문화시설을 사진과 함께 확인하세요.|Explore photos of attractions, restaurants and cultural venues within 5 km.
기준 촬영지|Starting location
즐길거리 찾기|Find activities
이 지역에 공개된 콘텐츠가 없습니다. 다른 지역을 선택해 주세요.|No published locations in this region. Please choose another.
추천 장소|Recommended places: 
장소 상세|Place details
이 장소로 일정 만들기|Plan a trip here
조건에 맞는 장소가 없습니다.|No places match your preferences.
다른 지역 또는 전체 콘텐츠 유형을 선택해 주세요.|Try another region or select all categories.
전체 추천 보기|View all recommendations
직접 선택한 장소|Your selected place
선택 지역 제한 없음|All regions included
비수도권 로컬 우선|Beyond the capital region
나만의 로컬 여행을|Your local adventure,
계획해 보세요.|planned your way.
좋아하는 콘텐츠와 여행 조건을 바탕으로 촬영지 코스를 추천해 드립니다.|Build a filming-location itinerary based on your interests and travel preferences.
선택한 장소|Selected place
여행 기본 정보|Trip details
여행 시작일|Start date
여행 종료일|End date
여행 지역|Destination
이동 수단|Transport
대중교통|Public transport
자가용|Car
도보 중심|Walking
동행자|Travel companions
혼자|Solo
친구|Friends
연인|Couple
가족|Family
콘텐츠 취향|Your interests
등록된 콘텐츠로 날짜별 코스를 구성합니다. 최대 31일까지 선택할 수 있어요.|Build a daily itinerary from registered locations. Choose up to 31 days.
추천 코스 만들기|Create itinerary
콘텐츠 먼저 둘러보기|Explore content first
여행 날짜를 확인해 주세요.|Check your travel dates.
시작일부터 종료일까지 1~31일의 유효한 날짜를 선택해 주세요.|Choose a valid date range of 1–31 days.
날짜 다시 선택하기|Change dates
조건 다시 설정하기|Change preferences
당일|Day trip
추천 코스| itinerary
선택한 날짜별로 최대 3곳씩 제안합니다. 방문 날짜와 순서를 자유롭게 조정하세요.|We suggest up to three places per day. Adjust the dates and order as you like.
여행| trip
개의 촬영지 후보| possible filming locations
지역 35 · 취향 30 · 비수도권 20점 기준|Scoring: region 35 · interests 30 · outside the capital 20
저장한 장소 보기|View saved places
등록된 공개 콘텐츠를 이용한 추천입니다. 후보가 부족한 날은 자유 일정으로 표시합니다. 이동 수단과 여행 인원은 일정에 기록되며, 이동 시간과 영업시간은 아직 추천에 반영되지 않습니다.|Recommendations use published locations. Days without enough places are left open. Transport and companions are saved with your trip; travel times and opening hours are not yet factored in.
일 · 촬영지| days · Filming locations: 
곳 · 주변 관광지| · Nearby attractions: 
처리 중…|Processing…
일정 저장됨 · 저장 취소|Saved · Unsave
일정 저장|Save itinerary
수정한 내용은 자동으로 저장됩니다.|Changes are saved automatically.
날짜별 장소를 조정하고 로그인 후 저장하세요.|Arrange your daily stops, then log in to save.
일정 날짜|Trip days
자유 일정|Free time
이 날짜에는 아직 담은 장소가 없습니다. 아래 후보에서 추가하거나 다른 날짜의 장소를 옮겨 주세요.|No stops yet. Add a place below or move one from another day.
장소·지도 보기|View place and map
방문 날짜|Visit date
일정에서 제외|Remove from itinerary
촬영지 추가|Add filming location
추가할 장소를 선택하세요|Choose a place to add
추가할 촬영지 후보가 없습니다|No more locations available
변경한 일정을 저장해 주세요.|Save your updated itinerary.
일정을 저장했습니다.|Itinerary saved.
일정 저장을 취소했습니다. 다시 눌러 저장할 수 있습니다.|Itinerary unsaved. Click again to save it.
저장 취소에 실패했습니다.|Unable to unsave the itinerary.
저장하지 못했습니다. 다시 시도해 주세요.|Unable to save. Please try again.
촬영지 다음에 들를 곳|Explore after your filming-location visit
한국관광공사 관광정보 · 촬영지와 별개의 주변 방문 장소입니다.|Korea Tourism Organization · These are nearby attractions, not filming locations.
일정에 담은 관광지|Added attraction
제외|Remove
주변 관광지 조회 중…|Finding nearby attractions…
주변 관광지 다시 조회|Refresh nearby attractions
주변 5km 관광지 찾아 담기|Find attractions within 5 km
촬영지 기준 약|About 
km · 이동 경로 거리와 다를 수 있음| km from the filming location · Actual travel distance may differ
담김|Added
일정에 추가|Add to itinerary
관광지는 일정당 최대 10곳까지 담을 수 있습니다. 촬영지를 삭제하면 연결된 관광지도 일정에서 제외됩니다. 영업시간과 실제 이동 동선은 방문 전에 확인해 주세요.|Add up to 10 attractions per itinerary. Removing a filming location also removes its linked attractions. Check opening hours and travel routes before visiting.
주변 5km에서 조회된 관광지가 없습니다.|No attractions found within 5 km.
관광정보를 불러오지 못했습니다. 잠시 후 다시 조회해 주세요. 저장한 일정은 그대로 유지됩니다.|Unable to load attractions. Try again later. Your saved itinerary is unchanged.
저장한 장소를|Your saved places,
다시 만나보세요.|ready to explore.
여행하고 싶은 촬영지를 모아두고 나만의 코스를 준비해 보세요.|Collect filming locations and plan your next adventure.
일정 만들기|Plan a trip
로그인 계정의 Firebase 자료입니다. 찜·일정 변경은 바로 저장되고 다른 기기에서도 같은 계정으로 확인할 수 있습니다.|Your saved places and itineraries sync automatically across devices with the same account.
저장한 여행 일정|Saved itineraries
코스| itinerary
· 촬영지|· Filming locations: 
곳 · 관광지| · Attractions: 
주변 관광:|Nearby attractions: 
일정 열기·수정|Open / edit itinerary
삭제|Delete
저장 일정 수정|Edit saved itinerary
닫기|Close
현재 조회할 수 없는 장소|Unavailable places: 
현재 조회할 수 없는 저장 장소|Unavailable saved places: 
개가 있습니다. 비공개 또는 일시적인 연결 문제일 수 있습니다.| may be private or temporarily unavailable.
개가 있어 편집을 잠시 중단합니다. 장소가 다시 조회되면 기존 순서대로 수정할 수 있습니다. 저장된 일정은 그대로 보관됩니다.| are currently unavailable. Editing will resume when they return. Your itinerary is preserved.
아직 저장한 장소가 없습니다.|No saved places yet.
마음에 드는 촬영지를 저장하면 이곳에서 한눈에 확인할 수 있어요.|Save your favorite filming locations to find them here.
장소 탐색하기|Explore places
저장 해제|Unsave
나의 K-SPOT 여행|My K-SPOT trips
저장한 장소와 일정, 최근 둘러본 곳을 한눈에 확인하세요.|Your saved places, itineraries and recent views in one place.
로그인하고 여행 저장하기|Log in to save your trips
마음에 드는 장소와 일정을 저장하고 다른 기기에서도 이어서 여행을 준비하세요.|Save places and itineraries and continue planning on any device.
로그인 / 회원가입|Log in / Sign up
회원|Member
님의 계정|'s account
찜·일정·최근 본 장소는 계정에 자동 저장됩니다. 다른 기기에서도 같은 계정으로 이어서 확인하세요.|Saved places, itineraries and recent views sync automatically with your account.
이전에 브라우저에 저장했던 자료 가져오기|Import previously saved browser data
이 기기에 남아 있는 이전 자료를 현재 계정으로 가져옵니다. 본인의 자료인지 확인해 주세요.|Import earlier data from this device into your account. Make sure it belongs to you.
이 계정의 이전 자료 가져오기|Import this account's earlier data
이전 비회원 자료 가져오기|Import earlier guest data
로그아웃|Log out
나의 저장 현황|My saved items
저장한 장소|Saved places
저장한 일정|Saved itineraries
저장한 여행 보기|View saved trips
새 일정 만들기|New itinerary
최근 본 장소|Recently viewed places
최근 둘러본 장소를 다시 찾아보세요. 지울 기록을 선택할 수 있습니다.|Revisit recent places or select records to remove.
전체 선택|Select all
지우는 중…|Removing…
선택 지우기|Remove selected
아직 조회 기록이 없습니다.|No recently viewed places.
선택한 최근 본 장소 기록을 삭제했습니다.|Selected history removed.
나의 여행 계정|Your travel account
이메일로 가입하고 다른 기기에서도 여행 자료를 불러오세요.|Sign up with email and access your trips on any device.
계정 메뉴|Account options
로그인|Log in
회원가입|Sign up
비밀번호 재설정|Reset password
다시 만나서 반가워요|Welcome back
나의 여행을 모아보세요|Start collecting your adventures
비밀번호를 잊으셨나요?|Forgot your password?
이메일과 비밀번호로 로그인하세요.|Log in with your email and password.
간단한 가입 후 장소와 일정을 저장할 수 있어요.|Create an account to save places and itineraries.
가입한 이메일로 재설정 안내를 보내드립니다.|We will send reset instructions to your email.
이름 또는 닉네임|Name or nickname
이메일|Email
비밀번호|Password
비밀번호 확인|Confirm password
저장한 장소와 일정은 같은 계정으로 다른 기기에서도 확인할 수 있습니다.|Access your saved places and itineraries on any device.
로그인하기|Log in
계정 만들기|Create account
재설정 메일 보내기|Send reset email
Firebase 설정이 필요합니다.|Account services are not configured yet.
가입된 이메일이라면 비밀번호 재설정 안내가 전송됩니다. 받은편지함과 스팸함을 확인해 주세요.|If this email is registered, you will receive password reset instructions. Check your inbox and spam folder.
비밀번호 확인이 일치하지 않습니다.|Passwords do not match.
인증 서버에 연결하지 못했습니다. 네트워크 또는 브라우저의 연결 차단 설정을 확인해 주세요.|Unable to connect. Check your network and browser settings.
이메일 또는 비밀번호가 일치하지 않습니다.|Incorrect email or password.
현재 사이트의 Firebase 인증 도메인 설정이 필요합니다.|Authentication is not configured for this domain.
계정 인증은 성공했으나 로그인 연결에 실패했습니다. 잠시 후 다시 시도해 주세요.|Authentication succeeded, but the session could not be started. Please try again.
계정은 생성되었으나 로그인 연결에 실패했습니다. 로그인 탭에서 다시 시도해 주세요.|Account created. Please try logging in again.
요청이 많습니다. 잠시 후 다시 시도해 주세요.|Too many requests. Please try again later.
더 긴 비밀번호를 사용해 주세요.|Please use a longer password.
가입할 수 없는 이메일입니다. 기존 계정이라면 로그인 또는 비밀번호 재설정을 이용해 주세요.|This email cannot be registered. Try logging in or resetting your password.
내 여행을 불러오는 중…|Loading your trips…
변경사항을 저장하는 중…|Saving changes…
다시 불러오기|Retry
로그인 후 저장할 수 있습니다.|Log in to save.
저장에 실패했습니다.|Unable to save.
삭제에 실패했습니다.|Unable to delete.
삭제하지 못했습니다.|Unable to delete.
저장 해제에 실패했습니다.|Unable to unsave.
로그아웃하지 못했습니다.|Unable to log out.
이전하지 못했습니다.|Unable to import data.
이전 자료를 계정에 가져왔습니다. 기존 저장 자료와 브라우저 원본은 그대로 유지됩니다.|Earlier data imported. Existing account data and the browser originals are unchanged.
로그인 계정이 변경되었습니다. 새로고침해 주세요.|Your account changed. Please refresh the page.
계정이 변경되었습니다. 새로고침해 주세요.|Your account changed. Please refresh the page.
Firebase에 저장하지 못했습니다. 연결을 확인한 후 다시 시도해 주세요.|Unable to save. Check your connection and try again.
다른 기기에서 삭제된 일정입니다. 목록을 새로고침해 주세요.|This itinerary was removed on another device. Refresh the list.
요청한 페이지를 찾지 못했어요.|Page not found.
주소가 정확한지 확인하거나 홈에서 다시 시작해 주세요.|Check the address or return to the home page.
홈으로 가기|Go home
페이지를 불러오는 중|Loading page
콘텐츠 유형 빠른 필터|Quick category filters
원문 안내|Place names, addresses and editorial descriptions are shown as registered, often in Korean. Map labels and external websites use their own language settings.
언어 변경 안내|Changing language reloads this page. Save any itinerary edits first.
`;
export const english: Record<string, string> = Object.fromEntries(entries.trim().split("\n").map((line) => { const index = line.indexOf("|"); return [line.slice(0, index), line.slice(index + 1)]; }));

export function translate(text: string, locale: Locale): string {
  if (locale === "ko") return text;
  const key = text.trim();
  if (english[key] !== undefined) return text.replace(key, english[key]);
  const patterns: [RegExp, (...values: string[]) => string][] = [
    [/^(\d+)박 (\d+)일$/, (n, d) => `${d} days / ${n} nights`],
    [/^(\d+)일차$/, (d) => `Day ${d}`],
    [/^(.+) 썸네일$/, (title) => `${title} thumbnail`],
    [/^(.+) 기록 선택$/, (name) => `Select history: ${name}`],
    [/^(.+) 선택$/, (name) => `Select ${name}`],
    [/^(.+) 방문 날짜$/, (name) => `Visit date for ${name}`],
    [/^(.+) 앞으로 이동$/, (name) => `Move ${name} earlier`],
    [/^(.+) 뒤로 이동$/, (name) => `Move ${name} later`],
    [/^(.+) 일정에서 제외$/, (name) => `Remove ${name} from itinerary`],
    [/^(.+) 일정에 추가$/, (name) => `Add ${name} to itinerary`],
    [/^(.+) 촬영지 추가$/, (day) => `Add filming location to ${day}`],
    [/^(.+) 주변 관광지$/, (name) => `Attractions near ${name}`],
    [/^추천 (\d+)점$/, (score) => `Recommendation score: ${score}`],
    [/^([\d,]+)m 거리$/, (d) => `${d} m away`],
    [/^검수 완료 · (.+)$/, (date) => `Verified · ${date}`],
    [/^(.+) 지역 일치$/, (region) => `Region match: ${translate(region, locale)}`],
    [/^(.+) 취향 일치$/, (type) => `Interest match: ${translate(type, locale)}`],
    [/^(.+) 자료를 근거로 작품과 장소의 관계를 확인했습니다\.$/, (source) => `The content and location connection was checked using ${source}.`],
    [/^처리하지 못했습니다\. 다시 시도해 주세요\.(.*)$/, (code) => `Unable to complete the request. Please try again.${code}`],
  ];
  for (const [pattern, render] of patterns) { const match = key.match(pattern); if (match) return render(...match.slice(1)); }
  return text;
}
