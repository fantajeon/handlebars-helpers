/**
 * This file provides the mock "data" received
 * by your visualization code when you develop
 * locally.
 *
 */
export const message = {
  tables: {
    DEFAULT: [
      {
        "data_id": "1efb6c14-9bed-62d3-a0b4-84cc5069f345",
        "tracking_id": "1efb6c14-9bed-641a-ad4a-542d4929d6c9",
        "data_source": "s3://hyeokjune-test/cat\u003dmlperf/label\u003dperformance/D\u003d20241210/id\u003d1efb6c14-9bed-62d3-a0b4-84cc5069f345",
        "data_category": "mlperf",
        "data_label": "performance",
        "timestamp": "2024-12-10 06:37:55.000000 UTC",
        "json_envs": "{\"datetime\":\"2024-12-10 15:37:55 +0900\",\"furiosa-runtime commit\":\"aeefc28a400eac22a8bfc09e189e06903f0d14b9\",\"furiosa_packages\":{\"furiosa-compiler-bridge\":\"0.11.0-3+nightly-241208\",\"furiosa-driver-rngd\":\"1.0.15-3\",\"furiosa-firmware-image-rngd\":\"0.0.21\",\"furiosa-firmware-tools-rngd\":\"1.0.15-3\",\"furiosa-libhal-nvp\":\"0.11.0-3+nightly-241208\",\"furiosa-libsmi\":\"2024.1.0-3\",\"furiosa-mlperf-resources\":\"4.1.0\",\"furiosa-pert-rngd\":\"0.1.0-3+nightly-241128+adf0131\",\"furiosa-smi\":\"2024.1.0-3\"},\"host\":\"Linux furiosa-Z13PE-D16-000 6.8.0-49-generic #49~22.04.1-Ubuntu SMP PREEMPT_DYNAMIC Wed Nov  6 17:42:15 UTC 2 x86_64 x86_64 x86_64 GNU/Linux\"}",
        "testcase_name": null,
        "mlperf_summary": null,
        "model_name": "GPT-J",
        "test_mode": "PerformanceOnly",
        "model_category": "gptj",
        "scenario": "Offline",
        "sut_name": "GPT-J SUT",
        "result_state": "VALID",
        "samples_per_second": "9.91768",
        "tokens_per_second": "684.32",
        "exact_match": null,
        "f1": null,
        "rouge1": null,
        "rouge2": null,
        "rougeL": null,
        "rougeLsum": null,
        "gen_len": null,
        "gen_num": null,
        "gen_tok_len": null
      }
    ],
  },
  fields: {
    dimID: [
      {
        id: 'qt_nzqx6a0xvb',
        name: 'Age Group',
        type: 'TEXT',
        concept: 'DIMENSION',
      },
      {
        id: 'qt_nzqx6a0xvb',
        name: 'Age',
        type: 'TEXT',
        concept: 'DIMENSION',
      },
      {
        id: 'qt_nzqx6a0xvb',
        name: 'json_string_profile',
        type: 'TEXT',
        concept: 'DIMENSION',
      },
      {
        id: 'qt_nzqx6a0xvb',
        name: 'json_data',
        type: 'TEXT',
        concept: 'DIMENSION',
      },
    ]
  },
  style: {
    bodyTemplate: {
      value: "<div class='card'>{{data_id}} {{data_source}} {{data_category}} {{data_label}} {{timestamp}} {{JsonTree json_envs}} {{testcase_name}} {{mlperf_summary}} {{model_name}} {{test_mode}} {{model_category}} {{scenario}} {{sut_name}} {{result_state}} {{samples_per_second}} {{tokens_per_second}} {{exact_match}} {{f1}} {{rouge1}} {{rouge2}} {{rougeL}} {{rougeLsum}} {{gen_len}} {{gen_num}} {{gen_tok_len}}</div>",
    },
    scriptTemplate: {
      value: "console.log('Hello, World!');",
    },
  },
};
