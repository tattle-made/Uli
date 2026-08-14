# Find eligible builder and runner images on Docker Hub. We use Ubuntu/Debian
# instead of Alpine to avoid DNS resolution issues in production.
#
# https://hub.docker.com/r/hexpm/elixir/tags?page=1&name=ubuntu
# https://hub.docker.com/_/ubuntu?tab=tags
#
# This file is based on these images:
#
#   - https://hub.docker.com/r/hexpm/elixir/tags - for the build image
#   - https://hub.docker.com/_/debian?tab=tags&page=1&name=bullseye-20240701-slim - for the release image
#   - https://pkgs.org/ - resource for finding needed packages
#   - Ex: hexpm/elixir:1.17.2-erlang-27.0-debian-bullseye-20240701-slim
#
# 1.18.4-erlang-27.3.4.14-ubuntu-jammy-20260627 <- Current Image
ARG ELIXIR_VERSION=1.18.4
ARG OTP_VERSION=27.3.4.14
ARG DEBIAN_VERSION=ubuntu-jammy-20260627
ARG RUNNER_DEBIAN_VERSION=jammy-20260627

ARG BUILDER_IMAGE="hexpm/elixir:${ELIXIR_VERSION}-erlang-${OTP_VERSION}-${DEBIAN_VERSION}"
ARG RUNNER_IMAGE="ubuntu:${RUNNER_DEBIAN_VERSION}"

FROM ${BUILDER_IMAGE} as builder

# install build dependencies and python
RUN apt-get update -y && apt-get install -y build-essential git npm \
  python3 python3-venv \
  && apt-get clean && rm -f /var/lib/apt/lists/*_*

# install a pinned uv binary (avoids curl | sh executing an unpinned,
# unverified remote script as root on every build)
COPY --from=ghcr.io/astral-sh/uv:0.6.16 /uv /uvx /usr/local/bin/

# prepare build dir
WORKDIR /app

# set up the python venv, install deps, and pre-download the
# vyakyarth model weights used in advanced search (~1.1GB, the heaviest
# step in this build). Copied in and run before any Elixir/Phoenix step,
# on its own COPY, so this layer's cache key depends only on lib/python's
# own content - it's untouched by changes to mix.exs, other lib/**/*.ex
# files, assets, etc.
# --locked asserts uv.lock matches pyproject.toml and fails instead of
# re-resolving, so transitive dependency versions are pinned and builds
# are reproducible. --no-install-project skips installing this directory
# as a package - lib/python is just scripts, not something imported.
# HF_HOME pins the download location inside the project dir instead of the
# default ~/.cache, so it's copyable into the runner stage below.
COPY lib/python lib/python
ENV HF_HOME=/app/lib/python/.cache/huggingface
RUN cd lib/python && uv sync --locked --no-install-project \
  && .venv/bin/python -c "import text_vec; text_vec.initialize()"

# install hex + rebar
RUN mix local.hex --force && \
  mix local.rebar --force

# set build ENV
ENV MIX_ENV="prod"

# install mix dependencies
COPY mix.exs mix.lock ./
RUN mix deps.get --only $MIX_ENV
RUN mkdir config

# copy compile-time config files before we compile dependencies
# to ensure any relevant config change will trigger the dependencies
# to be re-compiled.
COPY config/config.exs config/${MIX_ENV}.exs config/
RUN mix deps.compile

COPY priv priv

COPY lib lib

COPY assets assets

RUN npm install --prefix assets

# compile assets
RUN mix assets.deploy

# Compile the release
RUN mix compile

# Changes to config/runtime.exs don't require recompiling the code
COPY config/runtime.exs config/

#COPY rel rel
RUN mix release

# start a new build stage so that the final image will only contain
# the compiled release and other runtime necessities
FROM ${RUNNER_IMAGE}

RUN apt-get update -y && \
  apt-get install -y libstdc++6 openssl libncurses5 locales ca-certificates \
  python3 python3-venv \
  && apt-get clean && rm -f /var/lib/apt/lists/*_*

# Set the locale
RUN sed -i '/en_US.UTF-8/s/^# //g' /etc/locale.gen && locale-gen

ENV LANG en_US.UTF-8
ENV LANGUAGE en_US:en
ENV LC_ALL en_US.UTF-8

WORKDIR "/app"
RUN chown nobody /app

# set runner ENV
ENV MIX_ENV="prod"

# bring the python venv (deps + pre-downloaded model cache)
# into the runner image, and point HF_HOME at the same spot so the
# app finds the model without re-downloading it at runtime.
COPY --from=builder --chown=nobody:root /app/lib/python /app/lib/python
ENV HF_HOME=/app/lib/python/.cache/huggingface

# Only copy the final release from the build stage
COPY --from=builder --chown=nobody:root /app/_build/${MIX_ENV}/rel/uli_community ./

USER nobody

# If using an environment that doesn't automatically reap zombie processes, it is
# advised to add an init process such as tini via `apt-get install`
# above and adding an entrypoint. See https://github.com/krallin/tini for details
# ENTRYPOINT ["/tini", "--"]

CMD ["/app/bin/uli_community", "start"]
