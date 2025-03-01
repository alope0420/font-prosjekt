# Fontfaktor &ndash; a study of font readability

This repository contains code for a custom form created for the purpose of conducting
an experiment for the Human Computer Interaction course at Oslo Metropolitan University.
The goal of the experiment was to compare the test subjects' reading speed for two different
fonts - Arial and Comic Sans - and determine the presence of any significant deviations.
The test subjects were asked to find a given word in a list of similar-looking words,
and the time taken and number of errors was recorded. Our findings from statistical analysis
of the first 45 responses indicated the presence of significant deviations in the time taken
for the two fonts (in Arial's favor). The paper has not been published, but more details
could be provided if there is interest.

The codebase was originally designed to run on Vercel with a Redis instance on Upstash,
but should work fine in any Node.js-capable environment. The Redis API may need to be
switched out if a different provider than Upstash is used.

Due to time constraints, most of the codebase was developed in a matter of hours and
immediately put into production without any cleanup, as we could not risk making changes
that might compromise the test results once the experiment had started. There are bound
to be bugs, some of which are known, but not fixed due to practicality concerns.
Only minor efforts have been made to clean up the code following the conclusion of
the experiment. Use at your own risk.

The raw aggregated totals per test subject and font type collected during the experiment
are listed below. Measurements for individual questions can be found in INDIVIDUAL-QUESTIONS.md.
Note that the first 12 responses all represent distinct test subjects, even though the
browser IDs are repeated, as they were using loaner devices to take the test.

| response_id 	| browser_id 	    | font 	| time 	    | errors    |
|---------------|-------------------|-------|-----------|-----------|
| 1 	        | mvyymyruwm0adkv 	| 0 	| 70143 	| 0         |
| 1 	        | mvyymyruwm0adkv 	| 1 	| 96509 	| 0         |
| 2 	        | qia3z6bdc49hj3q 	| 0 	| 102905 	| 0         |
| 2 	        | qia3z6bdc49hj3q 	| 1 	| 87826 	| 0         |
| 3 	        | 2rum0264nbo4uxy 	| 0 	| 118607 	| 0         |
| 3 	        | 2rum0264nbo4uxy 	| 1 	| 105461 	| 0         |
| 4 	        | mvyymyruwm0adkv 	| 0 	| 88012 	| 0         |
| 4 	        | mvyymyruwm0adkv 	| 1 	| 106404 	| 0         |
| 5 	        | 2rum0264nbo4uxy 	| 0 	| 69035 	| 0         |
| 5 	        | 2rum0264nbo4uxy 	| 1 	| 97778 	| 1         |
| 6 	        | mvyymyruwm0adkv 	| 0 	| 101210 	| 1         |
| 6 	        | mvyymyruwm0adkv 	| 1 	| 101262 	| 0         |
| 7 	        | mvyymyruwm0adkv 	| 0 	| 97269 	| 0         |
| 7 	        | mvyymyruwm0adkv 	| 1 	| 100679 	| 0         |
| 8 	        | qia3z6bdc49hj3q 	| 0 	| 79727 	| 0         |
| 8 	        | qia3z6bdc49hj3q 	| 1 	| 66665 	| 0         |
| 9 	        | qia3z6bdc49hj3q 	| 0 	| 72082 	| 0         |
| 9 	        | qia3z6bdc49hj3q 	| 1 	| 64865 	| 0         |
| 10 	        | 2rum0264nbo4uxy 	| 0 	| 77973 	| 0         |
| 10 	        | 2rum0264nbo4uxy 	| 1 	| 87267 	| 0         |
| 11 	        | 2rum0264nbo4uxy 	| 0 	| 56063 	| 0         |
| 11 	        | 2rum0264nbo4uxy 	| 1 	| 60321 	| 0         |
| 12 	        | mvyymyruwm0adkv 	| 0 	| 55657 	| 0         |
| 12 	        | mvyymyruwm0adkv 	| 1 	| 59419 	| 0         |
| 13 	        | lbvar4p0wponb6k 	| 0 	| 70227 	| 0         |
| 13 	        | lbvar4p0wponb6k 	| 1 	| 85977 	| 0         |
| 14 	        | lbvar4p0wponb6k 	| 0 	| 68189 	| 0         |
| 14 	        | lbvar4p0wponb6k 	| 1 	| 75306 	| 0         |
| 15 	        | lbvar4p0wponb6k 	| 0 	| 67942 	| 0         |
| 15 	        | lbvar4p0wponb6k 	| 1 	| 73564 	| 0         |
| 16 	        | kr1tutmcg2n5h1h 	| 0 	| 61898 	| 0         |
| 16 	        | kr1tutmcg2n5h1h 	| 1 	| 64273 	| 0         |
| 17 	        | kr1tutmcg2n5h1h 	| 0 	| 68792 	| 0         |
| 17 	        | kr1tutmcg2n5h1h 	| 1 	| 92936 	| 0         |
| 18 	        | kr1tutmcg2n5h1h 	| 0 	| 64095 	| 0         |
| 18 	        | kr1tutmcg2n5h1h 	| 1 	| 63536 	| 0         |
| 19 	        | x03fjlt3gabuciz 	| 0 	| 50529 	| 0         |
| 19 	        | x03fjlt3gabuciz 	| 1 	| 52714 	| 0         |
| 20 	        | 1ephh37wzomqdz7 	| 0 	| 80656 	| 0         |
| 20 	        | 1ephh37wzomqdz7 	| 1 	| 77110 	| 0         |
| 21 	        | ntzn8j1o3ffx5xs 	| 0 	| 113807 	| 0         |
| 21 	        | ntzn8j1o3ffx5xs 	| 1 	| 113319 	| 1         |
| 22 	        | ntzn8j1o3ffx5xs 	| 0 	| 92399 	| 0         |
| 22 	        | ntzn8j1o3ffx5xs 	| 1 	| 77050 	| 0         |
| 23 	        | ntzn8j1o3ffx5xs 	| 0 	| 87978 	| 0         |
| 23 	        | ntzn8j1o3ffx5xs 	| 1 	| 121785 	| 1         |
| 24 	        | ntzn8j1o3ffx5xs 	| 0 	| 85195 	| 0         |
| 24 	        | ntzn8j1o3ffx5xs 	| 1 	| 77946 	| 0         |
| 25 	        | e5f0n6avyr3d8rp 	| 0 	| 82435 	| 0         |
| 25 	        | e5f0n6avyr3d8rp 	| 1 	| 77805 	| 0         |
| 26 	        | e5f0n6avyr3d8rp 	| 0 	| 81895 	| 0         |
| 26 	        | e5f0n6avyr3d8rp 	| 1 	| 82218 	| 1         |
| 27 	        | mvyymyruwm0adkv 	| 0 	| 62316 	| 0         |
| 27 	        | mvyymyruwm0adkv 	| 1 	| 55919 	| 0         |
| 28 	        | l1ckxyi85780ru4 	| 0 	| 97939 	| 0         |
| 28 	        | l1ckxyi85780ru4 	| 1 	| 138119 	| 0         |
| 29 	        | 5yccl7ik55is3xw 	| 0 	| 59372 	| 0         |
| 29 	        | 5yccl7ik55is3xw 	| 1 	| 59802 	| 0         |
| 30 	        | 5yccl7ik55is3xw 	| 0 	| 56135 	| 0         |
| 30 	        | 5yccl7ik55is3xw 	| 1 	| 68700 	| 0         |
| 31 	        | nfz0ntjveyguj2q 	| 0 	| 59535 	| 0         |
| 31 	        | nfz0ntjveyguj2q 	| 1 	| 81700 	| 1         |
| 32 	        | 4lugqyg3aeor9ja 	| 0 	| 97477 	| 0         |
| 32 	        | 4lugqyg3aeor9ja 	| 1 	| 92989 	| 1         |
| 33 	        | nfz0ntjveyguj2q 	| 0 	| 59368 	| 0         |
| 33 	        | nfz0ntjveyguj2q 	| 1 	| 69315 	| 0         |
| 34 	        | nfz0ntjveyguj2q 	| 0 	| 63463 	| 0         |
| 34 	        | nfz0ntjveyguj2q 	| 1 	| 54507 	| 0         |
| 35 	        | nfz0ntjveyguj2q 	| 0 	| 74238 	| 0         |
| 35 	        | nfz0ntjveyguj2q 	| 1 	| 60226 	| 0         |
| 36 	        | nfz0ntjveyguj2q 	| 0 	| 70879 	| 0         |
| 36 	        | nfz0ntjveyguj2q 	| 1 	| 72779 	| 0         |
| 37 	        | nfz0ntjveyguj2q 	| 0 	| 48924 	| 0         |
| 37 	        | nfz0ntjveyguj2q 	| 1 	| 65286 	| 0         |
| 38 	        | 4lugqyg3aeor9ja 	| 0 	| 95166 	| 1         |
| 38 	        | 4lugqyg3aeor9ja 	| 1 	| 74409 	| 0         |
| 39 	        | 4lugqyg3aeor9ja 	| 0 	| 95889 	| 0         |
| 39 	        | 4lugqyg3aeor9ja 	| 1 	| 93468 	| 0         |
| 40 	        | sjpvfsbem6hh933 	| 0 	| 105039 	| 1         |
| 40 	        | sjpvfsbem6hh933 	| 1 	| 88435 	| 0         |
| 41 	        | zaeyni609tenqb3 	| 0 	| 45563 	| 0         |
| 41 	        | zaeyni609tenqb3 	| 1 	| 48504 	| 0         |
| 42 	        | hz38a21lxdjmk6m 	| 0 	| 105395 	| 0         |
| 42 	        | hz38a21lxdjmk6m 	| 1 	| 150061 	| 0         |
| 43 	        | 3ouo1b1vovihyly 	| 0 	| 72115 	| 0         |
| 43 	        | 3ouo1b1vovihyly 	| 1 	| 89038 	| 2         |
| 44 	        | mvyymyruwm0adkv 	| 0 	| 78629 	| 0         |
| 44 	        | mvyymyruwm0adkv 	| 1 	| 114022 	| 0         |
| 45 	        | xhnb4djxbjfl8zf 	| 0 	| 49955 	| 1         |
| 45 	        | xhnb4djxbjfl8zf 	| 1 	| 83054 	| 0         |
| 46 	        | lopu3ddved0druo 	| 0 	| 109629 	| 0         |
| 46 	        | lopu3ddved0druo 	| 1 	| 103094 	| 0         |
| 47 	        | abnhabgnrn2m4iq 	| 0 	| 89712 	| 0         |
| 47 	        | abnhabgnrn2m4iq 	| 1 	| 67413 	| 2         |
| 48 	        | njci8r8feb3hft7 	| 0 	| 67743 	| 0         |
| 48 	        | njci8r8feb3hft7 	| 1 	| 89418 	| 0         |
| 49 	        | ikd9ubdpx1qgemf 	| 0 	| 105314 	| 0         |
| 49 	        | ikd9ubdpx1qgemf 	| 1 	| 138197 	| 0         |
| 50 	        | ikd9ubdpx1qgemf 	| 0 	| 87475 	| 0         |
| 50 	        | ikd9ubdpx1qgemf 	| 1 	| 90522 	| 1         |
| 51 	        | ikd9ubdpx1qgemf 	| 0 	| 88417 	| 0         |
| 51 	        | ikd9ubdpx1qgemf 	| 1 	| 90980 	| 0         |
| 52 	        | hed81vd2q8b4dni 	| 0 	| 175366 	| 0         |
| 52 	        | hed81vd2q8b4dni 	| 1 	| 157717 	| 0         |
| 53 	        | 4ywuhw9p7n5ya2c 	| 0 	| 81073 	| 0         |
| 53 	        | 4ywuhw9p7n5ya2c 	| 1 	| 100931 	| 0         |
| 54 	        | qyvmfj4ny1ggjvk 	| 0 	| 92187 	| 0         |
| 54 	        | qyvmfj4ny1ggjvk 	| 1 	| 73081 	| 0         |
| 55 	        | p0a25uljpt4kv7j 	| 0 	| 94046 	| 0         |
| 55 	        | p0a25uljpt4kv7j 	| 1 	| 137406 	| 0         |
| 56 	        | hgrvc0v9rjbjjvl 	| 0 	| 134834 	| 0         |
| 56 	        | hgrvc0v9rjbjjvl 	| 1 	| 146844 	| 0         |
| 57 	        | ggbtrthl5rh6dbt 	| 0 	| 78610 	| 0         |
| 57 	        | ggbtrthl5rh6dbt 	| 1 	| 89824 	| 0         |
| 58 	        | 88mnudcbk5fhupt 	| 0 	| 109231 	| 0         |
| 58 	        | 88mnudcbk5fhupt 	| 1 	| 106868 	| 0         |
