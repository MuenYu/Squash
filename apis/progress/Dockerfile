FROM public.ecr.aws/lambda/nodejs:20

WORKDIR ${LAMBDA_TASK_ROOT}
COPY ./progress/package.json ./
RUN npm i
COPY ./progress/app.mjs ./
  
CMD [ "app.handler" ]